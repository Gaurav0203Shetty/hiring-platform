import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateAdvancedMatchBreakdown } from '@/lib/match';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const candidateId = searchParams.get('candidateId');

  if (!jobId || !candidateId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  const candidate = await prisma.user.findUnique({ where: { id: candidateId } });

  if (!job || !candidate) {
    return NextResponse.json({ error: 'Job or candidate not found' }, { status: 404 });
  }

  // Fetch Weighted Skills
  const candidateSkills = await prisma.candidateSkill.findMany({
    where: { candidateId: candidate.id },
  });
  // Convert job.requiredSkills string to WeightedSkill array (assume weight=5 for each)
  const jobSkills = (job.requiredSkills || '')
    .split(',')
    .map((s) => ({ skill: s.trim(), weight: 5 }));

  // For text similarity, you'd need the candidate's full resume text and job's full description
  // For now, we assume candidateText = candidate.skills or some stored field
  const candidateText = candidate.skills || '';
  const jobText = job.description || '';

  const score = calculateAdvancedMatchBreakdown(candidateSkills, jobSkills, candidateText, jobText);

  return NextResponse.json([{ candidateId: candidate.id, score }]);
}
