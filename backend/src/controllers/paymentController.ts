import type { Request, Response } from 'express';
import { prisma } from '../prismaClient.js';

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        invoice: {
          include: {
            booking: {
              include: {
                customer: true
              }
            }
          }
        }
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    const formattedPayments = payments.map((p) => ({
      id: p.id,
      invoiceNumber: p.invoice?.invoiceNumber || '-',
      customerName: p.invoice?.booking?.customer?.fullname || '-',
      paymentMethod: p.paymentMethod,
      amount: p.amount,
      paymentDate: p.paymentDate,
      status: p.status,
    }));

    res.json(formattedPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
