import type { Request, Response } from 'express';
import { prisma } from '../prismaClient.js';

export const getFinancialReport = async (req: Request, res: Response) => {
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

    // Menghitung tren pendapatan bulanan
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

    res.json({
      totalRevenue,
      totalReceivables,
      thisMonthRevenue,
      totalCustomers,
      completedBookings
    });
  } catch (error) {
    console.error('Error generating financial report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
