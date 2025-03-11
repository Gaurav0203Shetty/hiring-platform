import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, skills, name, email } = await request.json();
    if (!userId || !skills) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        skills: Array.isArray(skills) ? skills.join(',') : skills,
        name: name || undefined,
        email: email || undefined,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
