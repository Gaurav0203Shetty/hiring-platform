'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Pusher from 'pusher-js';

export default function RecruiterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const recruiterId = session?.user?.id; // Recruiter's ID

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Protect route: Only recruiters allowed.
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'RECRUITER') {
      router.push('/auth');
    }
  }, [session, status, router]);

  // Fetch recruiter jobs.
  useEffect(() => {
    async function fetchJobs() {
      if (!recruiterId) return;
      try {
        const res = await fetch(`/api/jobs?recruiterId=${recruiterId}`);
        const jobsData = await res.json();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }
    fetchJobs();
  }, [recruiterId]);

  // Subscribe to real-time notifications.
  useEffect(() => {
    if (!session) return;
    // Initialize Pusher client with public key.
    const pusherCluster: string = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2";
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: pusherCluster,
    });

    const channel = pusher.subscribe('recruiter-channel');
    channel.bind('new-application', (data: any) => {
      setNotification(`New application received for job ${data.jobId}!`);
      // Optionally, refresh the applications list if the job is currently selected.
      if (selectedJob && data.jobId === selectedJob.id) {
        fetchApplicants(selectedJob.id);
      }
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe('recruiter-channel');
    };
  }, [session, selectedJob]);

  async function fetchApplicants(jobId: string) {
    try {
      const res = await fetch(`/api/applications/recruiter?recruiterId=${recruiterId}`);
      const data = await res.json();
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
      {notification && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {notification}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Required Skills: {job.requiredSkills}
              </p>
              <Button
                onClick={() => {
                  setSelectedJob(job);
                  fetchApplicants(job.id);
                }}
              >
                View Applicants
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedJob && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Applicants for {selectedJob.title}</h2>
          {applicants.length > 0 ? (
            <ul>
              {applicants.map((app) => (
                <li key={app.applicationId} className="mb-2">
                  <span className="font-medium">{app.name}</span> ({app.email}) - Match Score: {app.score}%
                </li>
              ))}
            </ul>
          ) : (
            <p>No applicants yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
