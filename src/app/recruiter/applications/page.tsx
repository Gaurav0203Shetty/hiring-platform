'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RecruiterApplications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const recruiterId = session?.user?.id;
  const [applications, setApplications] = useState<any[]>([]);

  // Protect route: only allow recruiters.
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'RECRUITER') {
      router.push('/auth');
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchApplications() {
      if (!recruiterId) return;
      try {
        const res = await fetch(`/api/applications/recruiter?recruiterId=${recruiterId}`);
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    }
    fetchApplications();
  }, [recruiterId]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Applicant Tracking</h1>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.applicationId} className="shadow-lg">
              <CardHeader>
                <CardTitle>{app.jobTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Candidate: {app.candidateName} ({app.candidateEmail})
                </p>
                <p className="text-sm text-gray-600">
                  Match Score: {app.score}% | Applied At: {new Date(app.appliedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
