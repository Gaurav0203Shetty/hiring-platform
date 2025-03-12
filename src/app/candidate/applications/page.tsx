'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CandidateApplications() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    async function fetchApplications() {
      if (!session || !session.user?.id) return;
      try {
        const res = await fetch(`/api/applications/candidate?candidateId=${session.user.id}`);
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching candidate applications:', error);
      }
    }
    fetchApplications();
  }, [session]);

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
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
                  Required Skills: {app.requiredSkills}
                </p>
                <p className="text-sm text-gray-600">
                  Applied At: {new Date(app.appliedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
