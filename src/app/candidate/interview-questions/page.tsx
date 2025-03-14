'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function InterviewQuestions() {
  const { data: session, status } = useSession();
  const [jobId, setJobId] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchQuestions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/interview-questions?jobId=${jobId}`);
      const data = await res.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching interview questions:', error);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') return <p>Loading...</p>;
  if (!session || session.user?.role !== 'CANDIDATE') return <p>Access Denied</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Interview Question Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter Job ID:
            </label>
            <Input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="e.g., job123"
              className="mt-1 block w-full"
            />
          </div>
          <Button onClick={fetchQuestions} disabled={loading || !jobId}>
            {loading ? 'Generating...' : 'Generate Questions'}
          </Button>
          {questions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Generated Questions:</h2>
              <ul className="list-disc pl-5 space-y-1">
                {questions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
