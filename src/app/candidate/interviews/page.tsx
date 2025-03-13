'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RequestInterview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobId, setJobId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === 'loading') return <p>Loading...</p>;
  if (!session || session.user?.role !== 'CANDIDATE') return <p>Access Denied</p>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          candidateId: session!.user!.id, // non-null assertion since session exists
          scheduledAt, // expected in ISO string format
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to request interview');
      }
      setMessage('Interview request submitted successfully!');
      // Optionally, clear the form:
      setJobId('');
      setScheduledAt('');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Request Interview</CardTitle>
        </CardHeader>
        <CardContent>
          {message && <p className="mb-4 text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="jobId" className="block text-sm font-medium text-gray-700">
                Job ID
              </Label>
              <Input
                id="jobId"
                type="text"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                required
                placeholder="Enter Job ID"
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <Label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
                Scheduled At (ISO DateTime)
              </Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="mt-1 block w-full"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Submitting...' : 'Request Interview'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
