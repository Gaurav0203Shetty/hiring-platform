'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CandidateDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect route: Only allow candidates.
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'CANDIDATE') {
      router.push('/auth');
    }
  }, [session, status, router]);

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Candidate Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome, {session?.user?.name || 'Candidate'}!</p>
          <p>Here you can browse jobs and apply for positions.</p>
          {/* Additional candidate-specific content goes here */}
        </CardContent>
      </Card>
    </div>
  );
}
