import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const dummyCandidateApplications = [
  {
    id: 'dummy-app-1',
    jobId: 'dummy-job-1',
    candidateId: 'dummy-candidate-1',
    createdAt: new Date(),
    job: {
      id: 'dummy-job-1',
      title: 'Frontend Developer',
      description: 'Build modern UIs',
      requiredSkills: 'javascript, react, html, css',
      recruiterId: 'dummy-recruiter',
      createdAt: new Date(),
    },
  },
  {
    id: 'dummy-app-2',
    jobId: 'dummy-job-2',
    candidateId: 'dummy-candidate-1',
    createdAt: new Date(),
    job: {
      id: 'dummy-job-2',
      title: 'Backend Developer',
      description: 'Develop robust APIs',
      requiredSkills: 'node.js, express, mongodb',
      recruiterId: 'dummy-recruiter',
      createdAt: new Date(),
    },
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const candidateId = searchParams.get('candidateId');
  if (!candidateId) {
    return NextResponse.json({ error: 'Missing candidateId parameter' }, { status: 400 });
  }
  let applications = await prisma.application.findMany({
    where: { candidateId },
    include: { job: true },
  });
  // If no applications exist, return dummy applications.
  if (!applications || applications.length === 0) {
    applications = dummyCandidateApplications as any;
  }
  // Map response to a simpler structure.
  const response = applications.map(app => ({
    applicationId: app.id,
    jobTitle: app.job?.title,
    requiredSkills: app.job?.requiredSkills,
    appliedAt: app.createdAt,
  }));
  return NextResponse.json(response);
}
