'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function NewJobPosting() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Wait for session to load
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // Redirect if not logged in or not a recruiter
  if (!session || session.user?.role !== 'RECRUITER') {
    router.push('/auth');
    return null;
  }

  // Now it's safe to access session.user
  const recruiterId = session.user.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          requiredSkills,
          recruiterId,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create job');
      }
      router.push('/recruiter/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">New Job Posting</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job Title
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Job Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700">
                Required Skills (comma-separated)
              </Label>
              <Input
                id="requiredSkills"
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                required
                className="mt-1 block w-full"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Create Job'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
