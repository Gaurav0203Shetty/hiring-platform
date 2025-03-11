// src/app/api/match/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateMatchScore } from '@/lib/match';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const candidateId = searchParams.get('candidateId');

  if (!jobId || !candidateId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Try to fetch the job from the database
  let job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    // Fallback dummy job data for testing if job not found in DB
    const dummyJobs = [
      { id: 'job1', title: 'Frontend Developer', requiredSkills: 'javascript, react, html, css' },
      { id: 'job2', title: 'Backend Developer', requiredSkills: 'node.js, express, mongodb' },
    ];
    job = dummyJobs.find((j) => j.id === jobId) as { id: string; requiredSkills: string } | undefined;
  }

  // Fetch candidate from the database
  const candidate = await prisma.user.findUnique({ where: { id: candidateId } });
  if (!job || !candidate) {
    return NextResponse.json({ error: 'Job or candidate not found' }, { status: 404 });
  }

  const candidateSkills = candidate.skills
    ? candidate.skills.split(',').map((s: string) => s.trim().toLowerCase())
    : [];
  const jobSkills = job.requiredSkills.split(',').map((s: string) => s.trim().toLowerCase());

  const score = calculateMatchScore(candidateSkills, jobSkills);

  // Return an array for consistency with the UI mapping
  return NextResponse.json([{ candidateId: candidate.id, score }]);
}
