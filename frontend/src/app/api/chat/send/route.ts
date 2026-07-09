import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function POST(request: Request) {
  try {
    const { senderId, receiverId, message } = await request.json();

    if (!senderId || !receiverId || !message || message.trim() === '') {
      return NextResponse.json({ error: 'senderId, receiverId, and message are required' }, { status: 400 });
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        message: message.trim(),
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending chat message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
