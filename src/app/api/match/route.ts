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
    const dummyJobs: {
      id: string;
      title: string;
      description: string;
      requiredSkills: string;
      recruiterId: string;
      createdAt: Date;
    }[] = [
      {
        id: 'job1',
        title: 'Frontend Developer',
        description: 'Develop and design user interfaces.',
        requiredSkills: 'javascript, react, html, css',
        recruiterId: 'dummy-recruiter',
        createdAt: new Date(),
      },
      {
        id: 'job2',
        title: 'Backend Developer',
        description: 'Build robust APIs and server-side logic.',
        requiredSkills: 'node.js, express, mongodb',
        recruiterId: 'dummy-recruiter',
        createdAt: new Date(),
      },
    ];
    job = dummyJobs.find((j) => j.id === jobId) || null;
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

  // Wrap the result in an array so that the UI mapping works
  return NextResponse.json([{ candidateId: candidate.id, score }]);
}
