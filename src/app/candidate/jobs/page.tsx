'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateSkillGap } from '@/lib/match';

export default function CandidateJobs() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
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

  // Parse candidate skills from session if available.
  const candidateSkills = session?.user?.skills
    ? session.user.skills.split(',').map((s: string) => s.trim().toLowerCase())
    : [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => {
          const jobSkills = job.requiredSkills
            .split(',')
            .map((s: string) => s.trim().toLowerCase());
          const missingSkills = calculateSkillGap(candidateSkills, jobSkills);

          return (
            <Card key={job.id} className="shadow-lg">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Required Skills: {job.requiredSkills}
                </p>
                {missingSkills.length > 0 && (
                  <p className="text-sm text-red-600 mb-2">
                    Missing Skills: {missingSkills.join(', ')}
                  </p>
                )}
                <Button onClick={() => setMessage(`Applied to ${job.title}`)}>
                  Apply
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
