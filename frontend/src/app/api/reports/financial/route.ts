import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Total Pemasukan (Paid Invoices / Payments)
    const payments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' }
    });
    
    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // Total Piutang (Unpaid Invoices)
    const unpaidInvoices = await prisma.invoice.findMany({
      where: { status: 'UNPAID' }
    });

    const totalReceivables = unpaidInvoices.reduce((sum, i) => sum + Number(i.total || 0), 0);

    // Total Pelanggan
    const totalCustomers = await prisma.customer.count();

    // Total Booking Selesai
    const completedBookings = await prisma.booking.count({
      where: { status: 'SELESAI' }
    });

    // Calculate monthly revenue trend
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const thisMonthPayments = await prisma.payment.findMany({
      where: {
        status: 'SUCCESS',
        paymentDate: {
          gte: currentMonthStart
        }
      }
    });

    const thisMonthRevenue = thisMonthPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return NextResponse.json({
      totalRevenue,
      totalReceivables,
      thisMonthRevenue,
      totalCustomers,
      completedBookings
    });
  } catch (error) {
    console.error('Error generating financial report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
