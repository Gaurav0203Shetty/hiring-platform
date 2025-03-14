'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ResumeImprovement() {
  const { data: session, status } = useSession();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSuggestions() {
      setLoading(true);
      try {
        const res = await fetch('/api/resume-improvement');
        const data = await res.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    }
    if (session && session.user) {
      fetchSuggestions();
    }
  }, [session]);

  if (status === 'loading') return <p>Loading...</p>;
  if (!session || session.user?.role !== 'CANDIDATE') return <p>Access Denied</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Resume Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading suggestions...</p>
          ) : suggestions.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {suggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          ) : (
            <p>No suggestions available at the moment.</p>
          )}
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh Suggestions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
