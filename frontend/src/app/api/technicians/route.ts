import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const technicians = await prisma.technician.findMany({
      include: {
        user: true,
        bookings: {
          include: {
            customer: true,
          },
          orderBy: {
            bookingDate: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedTechnicians = technicians.map((t) => ({
      id: t.id,
      fullname: t.user?.fullname || 'Tanpa Nama',
      phone: t.user?.phone || '-',
      specialty: t.specialty,
      status: t.status,
      createdAt: t.createdAt,
      bookings: t.bookings.map(b => ({
        id: b.id,
        bookingCode: b.bookingCode,
        customerName: b.customer?.fullname || 'Tanpa Nama',
        bookingDate: b.bookingDate,
        status: b.status,
      })),
    }));

    return NextResponse.json(formattedTechnicians);
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { fullname, phone, specialty } = await request.json();

    // Create User first
    const newUser = await prisma.user.create({
      data: {
        fullname,
        phone,
        role: 'TECHNICIAN',
      },
    });

    // Create Technician referencing User
    const newTechnician = await prisma.technician.create({
      data: {
        userId: newUser.id,
        specialty,
        status: 'Aktif',
      },
      include: {
        user: true,
      }
    });

    return NextResponse.json({
      id: newTechnician.id,
      fullname: newTechnician.user?.fullname,
      phone: newTechnician.user?.phone,
      specialty: newTechnician.specialty,
      status: newTechnician.status,
      createdAt: newTechnician.createdAt,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating technician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
