import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const candidateId = searchParams.get('candidateId');
  if (!candidateId) {
    return NextResponse.json({ error: 'Missing candidateId parameter' }, { status: 400 });
  }
  const favorites = await prisma.favorite.findMany({
    where: { candidateId },
    include: { job: true },
  });
  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  try {
    const { candidateId, jobId } = await request.json();
    if (!candidateId || !jobId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const favorite = await prisma.favorite.create({
      data: { candidateId, jobId },
    });
    return NextResponse.json(favorite);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
