import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Updated dummyApplications with all required fields for candidate and job.
const dummyApplications = [
  {
    id: 'dummy-app-1',
    jobId: 'dummy-job-1',
    candidateId: 'dummy-candidate-1',
    createdAt: new Date(),
    candidate: {
      id: 'dummy-candidate-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'dummy', // dummy value for password
      role: 'CANDIDATE',
      skills: 'javascript, react',
    },
    job: {
      id: 'dummy-job-1',
      title: 'Frontend Developer',
      description: 'Work on building modern UIs and responsive layouts.',
      requiredSkills: 'javascript, react, html, css',
      recruiterId: 'dummy-recruiter',
      createdAt: new Date(),
    },
  },
  {
    id: 'dummy-app-2',
    jobId: 'dummy-job-1',
    candidateId: 'dummy-candidate-2',
    createdAt: new Date(),
    candidate: {
      id: 'dummy-candidate-2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'dummy', // dummy value for password
      role: 'CANDIDATE',
      skills: 'node.js, express',
    },
    job: {
      id: 'dummy-job-1',
      title: 'Frontend Developer',
      description: 'Work on building modern UIs and responsive layouts.',
      requiredSkills: 'javascript, react, html, css',
      recruiterId: 'dummy-recruiter',
      createdAt: new Date(),
    },
  },
];

export async function POST(request: Request) {
  try {
    const { jobId, candidateId } = await request.json();
    if (!jobId || !candidateId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    const application = await prisma.application.create({
      data: { jobId, candidateId },
    });
    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 });
  }
  let applications = await prisma.application.findMany({
    where: { jobId },
    include: { candidate: true, job: true },
  });
  // If no applications are found in the database, use dummy applications.
  if (!applications || applications.length === 0) {
    applications = dummyApplications as any;
  }
  // Map the response to include candidate info and a dummy match score.
  const response = applications.map((app) => ({
    applicationId: app.id,
    candidateId: app.candidateId,
    name: app.candidate?.name,
    email: app.candidate?.email,
    jobTitle: app.job?.title,
    score: Math.floor(Math.random() * 100), // dummy score for demonstration
    appliedAt: app.createdAt,
  }));
  return NextResponse.json(response);
}
