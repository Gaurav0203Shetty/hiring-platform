'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RecruiterDashboard() {
  const { data: session } = useSession();
  const candidateId = session?.user?.id; // This should now be available (e.g., "303ac0cf-dd4f-4662-a663-6e0490fce109")
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);

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

  async function fetchMatches(jobId: string) {
    if (!candidateId) {
      console.error('Candidate ID not found in session');
      return;
    }
    try {
      const res = await fetch(`/api/match?jobId=${jobId}&candidateId=${candidateId}`);
      const matchData = await res.json();
      setMatches(matchData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Required Skills: {job.requiredSkills}</p>
              <Button onClick={() => {
                setSelectedJob(job);
                fetchMatches(job.id);
              }}>
                View Matches
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedJob && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Matches for {selectedJob.title}</h2>
          <ul>
            {matches.map((match) => (
              <li key={match.candidateId} className="mb-2">
                Candidate ID: {match.candidateId} - Compatibility Score: {match.score}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
