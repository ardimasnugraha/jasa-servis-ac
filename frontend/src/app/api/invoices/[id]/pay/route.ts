import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { amount, paymentMethod } = await request.json();

    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'Invoice is already paid' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceId: id,
        amount: amount !== undefined ? amount : invoice.total,
        paymentMethod,
        paymentDate: new Date(),
        status: 'SUCCESS',
      },
    });

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'PAID',
      },
    });

    return NextResponse.json({ payment, invoice: updatedInvoice });
  } catch (error) {
    console.error('Error paying invoice:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
