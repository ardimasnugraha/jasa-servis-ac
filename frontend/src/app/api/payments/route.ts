import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export const dynamic = 'force-dynamic';

export async function GET() {
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
      amount: p.amount ? Number(p.amount) : 0,
      paymentDate: p.paymentDate,
      status: p.status,
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
