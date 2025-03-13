import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pusher } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const { jobId, candidateId } = await request.json();
    if (!jobId || !candidateId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    const application = await prisma.application.create({
      data: { jobId, candidateId },
    });
    
    // Trigger a Pusher event for real-time notifications.
    await pusher.trigger('recruiter-channel', 'new-application', {
      applicationId: application.id,
      jobId: application.jobId,
      candidateId: application.candidateId,
    });
    
    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Existing GET implementation remains unchanged...
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 });
  }
  let applications = await prisma.application.findMany({
    where: { jobId },
    include: { candidate: true, job: true },
  });
  // Fallback to dummy data if necessary...
  if (!applications || applications.length === 0) {
    // (dummyApplications code from previous implementation)
  }
  const response = applications.map((app) => ({
    applicationId: app.id,
    candidateId: app.candidateId,
    name: app.candidate?.name,
    email: app.candidate?.email,
    jobTitle: app.job?.title,
    score: Math.floor(Math.random() * 100),
    appliedAt: app.createdAt,
  }));
  return NextResponse.json(response);
}
