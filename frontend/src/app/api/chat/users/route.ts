import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (currentUser.role === 'ADMIN') {
      // Find all non-admin users
      const users = await prisma.user.findMany({
        where: {
          role: { not: 'ADMIN' },
        },
        select: {
          id: true,
          fullname: true,
          email: true,
          phone: true,
          role: true,
        },
      });

      // For each user, fetch the last message and unread count
      const list = await Promise.all(
        users.map(async (u) => {
          const lastMsg = await prisma.chatMessage.findFirst({
            where: {
              OR: [
                { senderId: u.id, receiverId: currentUser.id },
                { senderId: currentUser.id, receiverId: u.id },
              ],
            },
            orderBy: { createdAt: 'desc' },
          });

          const unreadCount = await prisma.chatMessage.count({
            where: {
              senderId: u.id,
              receiverId: currentUser.id,
              isRead: false,
            },
          });

          return {
            ...u,
            lastMessage: lastMsg ? lastMsg.message : null,
            lastMessageAt: lastMsg ? lastMsg.createdAt : null,
            unreadCount,
          };
        })
      );

      // Sort by last message date, putting users who messaged recently first.
      // Users with no messages go to the bottom.
      list.sort((a, b) => {
        if (!a.lastMessageAt) return 1;
        if (!b.lastMessageAt) return -1;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      });

      return NextResponse.json(list);
    } else {
      // Current user is a regular customer.
      // They should see the admin "acep@gmail.com" as the ONLY contact.
      let admin = await prisma.user.findUnique({
        where: { email: 'acep@gmail.com' },
        select: {
          id: true,
          fullname: true,
          email: true,
          phone: true,
          role: true,
        },
      });

      if (!admin) {
        // Fallback to any ADMIN if acep@gmail.com is not found
        admin = await prisma.user.findFirst({
          where: { role: 'ADMIN' },
          select: {
            id: true,
            fullname: true,
            email: true,
            phone: true,
            role: true,
          },
        });
      }

      if (!admin) {
        return NextResponse.json([]);
      }

      const lastMsg = await prisma.chatMessage.findFirst({
        where: {
          OR: [
            { senderId: currentUser.id, receiverId: admin.id },
            { senderId: admin.id, receiverId: currentUser.id },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      const unreadCount = await prisma.chatMessage.count({
        where: {
          senderId: admin.id,
          receiverId: currentUser.id,
          isRead: false,
        },
      });

      const contact = {
        ...admin,
        fullname: admin.fullname || 'Acep (Admin)',
        lastMessage: lastMsg ? lastMsg.message : null,
        lastMessageAt: lastMsg ? lastMsg.createdAt : null,
        unreadCount,
      };

      return NextResponse.json([contact]);
    }
  } catch (error) {
    console.error('Error fetching chat users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
