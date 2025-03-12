'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RecruiterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const recruiterId = session?.user?.id; // Recruiter's ID from session

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Protect route: Only allow recruiters.
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'RECRUITER') {
      router.push('/auth');
    }
  }, [session, status, router]);

  // Fetch jobs posted by the recruiter.
  useEffect(() => {
    async function fetchJobs() {
      if (!recruiterId) return;
      try {
        // Your /api/jobs endpoint should filter by recruiterId.
        const res = await fetch(`/api/jobs?recruiterId=${recruiterId}`);
        const jobsData = await res.json();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }
    fetchJobs();
  }, [recruiterId]);

  // Fetch applicants for a specific job.
  async function fetchApplicants(jobId: string) {
    if (!recruiterId) {
      console.error('Recruiter ID not found in session');
      return;
    }
    try {
      const res = await fetch(`/api/applications/recruiter?recruiterId=${recruiterId}`);
      // Log the raw response text to debug the unexpected HTML
      const text = await res.text();
      console.log('Response text:', text);
      const data = JSON.parse(text);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  }
  

  async function fetchApplications() {
    if (!recruiterId) return;
    try {
      const res = await fetch(`/api/applications/recruiter?recruiterId=${recruiterId}`);
      const text = await res.text();
      console.log('Response text:', text);
      const data = JSON.parse(text);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }
  

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
      <p className="text-lg mb-4">Manage your job postings and view applicants.</p>

      {/* Jobs Grid */}
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
              <Button onClick={() => {
                setSelectedJob(job);
                fetchApplicants(job.id);
              }}>
                View Applicants
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applicants Section */}
      {selectedJob && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Applicants for {selectedJob.title}
          </h2>
          {applicants.length > 0 ? (
            <ul>
              {applicants.map((applicant) => (
                <li key={applicant.candidateId} className="mb-2">
                  <span className="font-medium">{applicant.name}</span> ({applicant.email}) - Match Score: {applicant.score}%
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
