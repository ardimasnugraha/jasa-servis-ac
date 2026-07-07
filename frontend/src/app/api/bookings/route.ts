import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
        technician: {
          include: {
            user: true,
          },
        },
      },
    });

    const formattedBookings = bookings.map((b) => ({
      id: b.id,
      bookingCode: b.bookingCode,
      customer: b.customer?.fullname || 'Tanpa Nama',
      customerPhone: b.customer?.phone || '-',
      customerEmail: b.customer?.email || '-',
      customerAddress: b.customer?.address || '-',
      complaint: b.complaint || '-',
      status: b.status,
      bookingDate: b.bookingDate,
      bookingTime: b.bookingTime,
      createdAt: b.createdAt,
      technician: b.technician ? {
        id: b.technician.id,
        fullname: b.technician.user?.fullname || 'Tanpa Nama',
        phone: b.technician.user?.phone || '-',
        specialty: b.technician.specialty || '-',
      } : null,
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { customerId, technicianId, bookingDate, bookingTime, complaint } = await request.json();

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingCode = `BKG-${dateStr}-${randomStr}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingCode,
        customerId: customerId || null,
        technicianId: technicianId || null,
        bookingDate: bookingDate ? new Date(bookingDate) : null,
        bookingTime: (bookingTime && bookingTime.includes(':')) ? new Date(`1970-01-01T${bookingTime}:00Z`) : null,
        complaint,
        status: 'MENUNGGU',
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
