'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateAdvancedMatchBreakdown, WeightedSkill } from '@/lib/match';

// Import dialog components (assuming you're using shadcn/ui's Dialog)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CandidateJobs() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  
  // Modal state for match details
  const [modalOpen, setModalOpen] = useState(false);
  const [matchBreakdown, setMatchBreakdown] = useState<{
    weightedScore: number;
    textScore: number;
    finalScore: number;
  } | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);

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

  // Filter jobs by search term
  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.requiredSkills.toLowerCase().includes(term)
    );
  });

  async function handleApply(jobId: string) {
    if (status === 'loading') return;
    if (!session || !session.user?.id) return;
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          candidateId: session.user.id,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to apply');
      }
      setMessage('Application submitted successfully!');
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  async function viewMatchDetails(job: any) {
    if (!session || !session.user) return;
    // For demonstration, assume candidateText is candidate skills and jobText is job description.
    const candidateSkills: WeightedSkill[] = session.user.skills
      ? session.user.skills.split(',').map((s: string) => ({ skill: s.trim(), weight: 5 }))
      : [];
    const jobSkills: WeightedSkill[] = job.requiredSkills
      .split(',')
      .map((s: string) => ({ skill: s.trim(), weight: 5 }));
    const candidateText = session.user.skills || '';
    const jobText = job.description || '';
    const breakdown = calculateAdvancedMatchBreakdown(candidateSkills, jobSkills, candidateText, jobText);
    setMatchBreakdown(breakdown);
    setSelectedJob(job);
    setModalOpen(true);
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Match Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Match Details for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          {matchBreakdown && (
            <div className="mt-4">
              <p>Weighted Skill Match: {matchBreakdown.weightedScore.toFixed(2)}%</p>
              <p>Text Similarity: {matchBreakdown.textScore.toFixed(2)}%</p>
              <p>Final Match Score: {matchBreakdown.finalScore.toFixed(2)}%</p>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <div className="mb-6">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or skills..."
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                Required Skills: {job.requiredSkills}
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => handleApply(job.id)}>
                  Apply
                </Button>
                <Button onClick={() => viewMatchDetails(job)}>
                  Match Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
