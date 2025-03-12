import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const dummyJobs = [
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
    description: 'Develop robust server-side applications and APIs.',
    requiredSkills: 'node.js, express, mongodb',
    recruiterId: 'dummy-recruiter',
    createdAt: new Date(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recruiterId = searchParams.get('recruiterId');
  let jobs;
  if (recruiterId) {
    jobs = await prisma.job.findMany({ where: { recruiterId } });
  } else {
    jobs = await prisma.job.findMany();
  }
  // If no jobs found in the database, use dummy jobs.
  if (!jobs || jobs.length === 0) {
    jobs = dummyJobs;
  }
  return NextResponse.json(jobs);
}

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
    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
