'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecruiterInterviews() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const recruiterId = session?.user?.id;
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'RECRUITER') {
      router.push('/auth');
      return;
    }
    async function fetchInterviews() {
      try {
        const res = await fetch(`/api/interviews?recruiterId=${recruiterId}`);
        const data = await res.json();
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    }
    fetchInterviews();
  }, [session, status, recruiterId, router]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Interview Requests</h1>
      {interviews.length === 0 ? (
        <p>No interview requests found.</p>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview.id} className="shadow-lg">
              <CardHeader>
                <CardTitle>{interview.job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Candidate: {interview.candidate.name} ({interview.candidate.email})
                </p>
                <p className="text-sm text-gray-600">
                  Scheduled At: {new Date(interview.scheduledAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {interview.status}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
