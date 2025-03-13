import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { candidateId, skill, weight } = await request.json();
    if (!candidateId || !skill) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    // Upsert or create a candidate skill
    const candidateSkill = await prisma.candidateSkill.upsert({
      where: {
        candidateId_skill: { candidateId, skill },
      },
      update: { weight },
      create: { candidateId, skill, weight: weight || 5 },
    });
    return NextResponse.json(candidateSkill);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
