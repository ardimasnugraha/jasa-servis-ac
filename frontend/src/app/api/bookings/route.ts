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
      customerId: b.customerId,
      customer: b.customer?.fullname || 'Tanpa Nama',
      customerPhone: b.customer?.phone || '-',
      customerEmail: b.customer?.email || '-',
      customerAddress: b.customer?.address || '-',
      complaint: b.complaint || '-',
      status: b.status,
      bookingDate: b.bookingDate,
      bookingTime: b.bookingTime ? new Date(b.bookingTime).toISOString().slice(11, 16) : null,
      createdAt: b.createdAt,
      rateType: b.rateType || 'DAILY',
      durationDays: b.durationDays || 1,
      numWorkers: b.numWorkers || 1,
      materialOption: b.materialOption || 'JASA_SAJA',
      totalEstimatedCost: b.totalEstimatedCost ? Number(b.totalEstimatedCost) : 0,
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
    const { 
      customerId, 
      technicianId, 
      bookingDate, 
      bookingTime, 
      complaint,
      rateType,
      durationDays,
      numWorkers,
      materialOption,
      totalEstimatedCost
    } = await request.json();

    let finalTechnicianId = technicianId || null;

    if (!finalTechnicianId) {
      // Cari semua teknisi yang berstatus 'Aktif'
      const activeTechnicians = await prisma.technician.findMany({
        where: {
          status: 'Aktif',
        },
        include: {
          bookings: true,
        },
      });

      // Cari teknisi yang tidak sedang dalam pengerjaan (status selain SELESAI, DIBATALKAN, CANCELLED)
      const availableTechnician = activeTechnicians.find((tech) => {
        const hasOngoingBooking = tech.bookings.some(
          (b) => b.status !== 'SELESAI' && b.status !== 'DIBATALKAN' && b.status !== 'CANCELLED' && b.status !== 'DIBATAL'
        );
        return !hasOngoingBooking;
      });

      if (availableTechnician) {
        finalTechnicianId = availableTechnician.id;
      }
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingCode = `BKG-${dateStr}-${randomStr}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingCode,
        customerId: customerId || null,
        technicianId: finalTechnicianId,
        bookingDate: bookingDate ? new Date(bookingDate) : null,
        bookingTime: (bookingTime && bookingTime.includes(':')) ? new Date(`1970-01-01T${bookingTime}:00Z`) : null,
        complaint,
        status: 'MENUNGGU',
        rateType: rateType || 'DAILY',
        durationDays: durationDays ? parseInt(durationDays.toString(), 10) : null,
        numWorkers: numWorkers ? parseInt(numWorkers.toString(), 10) : null,
        materialOption: materialOption || 'JASA_SAJA',
        totalEstimatedCost: totalEstimatedCost ? parseFloat(totalEstimatedCost.toString()) : null,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
