import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Candidate creates an interview request
export async function POST(request: Request) {
  try {
    const { jobId, candidateId, scheduledAt } = await request.json();
    if (!jobId || !candidateId || !scheduledAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const interview = await prisma.interview.create({
      data: {
        jobId,
        candidateId,
        scheduledAt: new Date(scheduledAt),
      },
    });
    return NextResponse.json(interview);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Recruiter fetches interview requests for their jobs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recruiterId = searchParams.get('recruiterId');
  if (!recruiterId) {
    return NextResponse.json({ error: 'Missing recruiterId parameter' }, { status: 400 });
  }
  // First, fetch jobs posted by this recruiter.
  const jobs = await prisma.job.findMany({
    where: { recruiterId },
    select: { id: true },
  });
  const jobIds = jobs.map(job => job.id);
  // Fetch interviews for those jobs.
  const interviews = await prisma.interview.findMany({
    where: { jobId: { in: jobIds } },
    include: { candidate: true, job: true },
  });
  return NextResponse.json(interviews);
}
