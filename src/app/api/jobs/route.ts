import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pusher } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const { title, description, requiredSkills, recruiterId } = await request.json();
    if (!title || !description || !requiredSkills || !recruiterId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const job = await prisma.job.create({
      data: {
        title,
        description,
        requiredSkills,
        recruiterId,
      },
    });
    // Trigger Pusher event for candidate notifications
    await pusher.trigger('candidate-channel', 'new-job', {
      id: job.id,
      title: job.title,
      description: job.description,
      requiredSkills: job.requiredSkills,
    });
    return NextResponse.json(job);
  } catch (error: any) {
    console.error('Error in /api/jobs POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recruiterId = searchParams.get('recruiterId');
    let jobs;
    if (recruiterId) {
      jobs = await prisma.job.findMany({ where: { recruiterId } });
    } else {
      jobs = await prisma.job.findMany();
    }
    // Fallback dummy data if no jobs found
    if (!jobs || jobs.length === 0) {
      jobs = [
        {
          id: 'dummy-job-1',
          title: 'Frontend Developer',
          description: 'Work on building modern UIs and responsive layouts.',
          requiredSkills: 'javascript, react, html, css',
          recruiterId: 'dummy-recruiter',
          createdAt: new Date(),
        },
        {
          id: 'dummy-job-2',
          title: 'Backend Developer',
          description: 'Develop robust APIs and server-side logic.',
          requiredSkills: 'node.js, express, mongodb',
          recruiterId: 'dummy-recruiter',
          createdAt: new Date(),
        },
      ];
    }
    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error('Error in /api/jobs GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
