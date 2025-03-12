'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CandidateJobs() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applying, setApplying] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        const jobsData = await res.json();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }
    fetchJobs();
  }, []);

  async function handleApply(jobId: string) {
    if (status === 'loading') return;
    if (!session || !session.user?.id) return;
    setApplying(jobId);
    setMessage(null);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          candidateId: session.user.id,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to apply');
      }
      setMessage('Application submitted successfully!');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setApplying(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Required Skills: {job.requiredSkills}</p>
              <Button onClick={() => handleApply(job.id)} disabled={applying === job.id}>
                {applying === job.id ? 'Applying...' : 'Apply'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
