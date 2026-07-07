import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reports = await prisma.serviceReport.findMany({
      include: {
        booking: {
          include: {
            customer: true,
          }
        },
        technician: {
          include: {
            user: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedReports = reports.map((r) => ({
      id: r.id,
      bookingCode: r.booking?.bookingCode || '-',
      customerName: r.booking?.customer?.fullname || 'Tanpa Nama',
      technicianName: r.technician?.user?.fullname || '-',
      diagnosis: r.diagnosis,
      actionTaken: r.actionTaken,
      totalCost: r.totalCost ? Number(r.totalCost) : 0,
      createdAt: r.createdAt,
    }));

    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error('Error fetching service reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { bookingId, technicianId, diagnosis, actionTaken, totalCost } = await request.json();

    const newReport = await prisma.serviceReport.create({
      data: {
        bookingId,
        technicianId: technicianId || null,
        diagnosis,
        actionTaken,
        totalCost: totalCost ? parseFloat(totalCost) || 0 : 0,
      },
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'SELESAI' },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Error creating service report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
