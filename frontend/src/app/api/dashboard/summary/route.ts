import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Total Pelanggan
    const totalCustomers = await prisma.customer.count();

    // Servis Hari Ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayServices = await prisma.booking.count({
      where: {
        bookingDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const pendingServices = await prisma.booking.count({
      where: {
        bookingDate: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ['PENDING', 'CONFIRMED', 'MENUNGGU'], // Support both English and Indonesian status enums
        },
      },
    });

    // Total Pendapatan (dari Invoice Lunas/Selesai)
    const invoices = await prisma.invoice.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: 'PAID',
      },
    });
    
    const totalRevenue = Number(invoices._sum.total || 0);

    // Recent Bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
      },
    });

    const formattedRecentBookings = recentBookings.map((b) => ({
      id: b.id,
      customer: b.customer?.fullname || 'Tanpa Nama',
      type: b.complaint || 'Servis AC', 
      status: b.status,
      date: b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) : 'TBA',
    }));

    return NextResponse.json({
      totalRevenue,
      totalCustomers,
      todayServices,
      pendingServices,
      recentBookings: formattedRecentBookings,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
