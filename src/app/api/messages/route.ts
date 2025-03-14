import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch messages between two users (could be enhanced with conversation IDs)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const senderId = searchParams.get('senderId');
  const receiverId = searchParams.get('receiverId');
  if (!senderId || !receiverId) {
    return NextResponse.json({ error: 'Missing senderId or receiverId' }, { status: 400 });
  }
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(messages);
}

// POST: Send a message
export async function POST(request: Request) {
  try {
    const { senderId, receiverId, content } = await request.json();
    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
