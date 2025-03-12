import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const dummyApplications = [
  {
    id: 'dummy-app-1',
    jobId: 'dummy-job-1',
    candidateId: 'dummy-candidate-1',
    createdAt: new Date(),
    candidate: { name: 'John Doe', email: 'john@example.com' },
    job: { title: 'Frontend Developer', requiredSkills: 'javascript, react, html, css' },
  },
  {
    id: 'dummy-app-2',
    jobId: 'dummy-job-1',
    candidateId: 'dummy-candidate-2',
    createdAt: new Date(),
    candidate: { name: 'Jane Doe', email: 'jane@example.com' },
    job: { title: 'Frontend Developer', requiredSkills: 'javascript, react, html, css' },
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recruiterId = searchParams.get('recruiterId');
  if (!recruiterId) {
    return NextResponse.json({ error: 'Missing recruiterId parameter' }, { status: 400 });
  }
  
  // Fetch all jobs posted by this recruiter.
  const jobs = await prisma.job.findMany({
    where: { recruiterId },
  });
  
  const jobIds = jobs.map(job => job.id);
  
  // Fetch applications for these jobs.
  let applications = await prisma.application.findMany({
    where: { jobId: { in: jobIds } },
    include: { candidate: true, job: true },
  });
  
  // Fallback to dummy data if no real applications exist.
  if (!applications || applications.length === 0) {
    applications = dummyApplications as any;
  }
  
  // Map the response to a simpler structure.
  const response = applications.map((app) => ({
    applicationId: app.id,
    candidateId: app.candidateId,
    candidateName: app.candidate?.name,
    candidateEmail: app.candidate?.email,
    jobTitle: app.job?.title,
    score: Math.floor(Math.random() * 100), // dummy match score
    appliedAt: app.createdAt,
  }));
  
  return NextResponse.json(response);
}
