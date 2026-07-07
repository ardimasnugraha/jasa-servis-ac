import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function POST(request: Request) {
  try {
    const { order_id, transaction_status, gross_amount, payment_type } = await request.json();

    console.log(`[WEBHOOK] Received payment notification for Order ID: ${order_id} with status: ${transaction_status}`);

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      const invoice = await prisma.invoice.findUnique({
        where: { id: order_id }
      });

      if (invoice && invoice.status !== 'PAID') {
        // Record payment
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            paymentMethod: payment_type || 'PAYMENT_GATEWAY',
            amount: invoice.total,
            paymentDate: new Date(),
            status: 'SUCCESS',
          }
        });

        // Update invoice status
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'PAID' }
        });

        console.log(`[WEBHOOK] Invoice ${invoice.invoiceNumber} successfully marked as PAID!`);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('[WEBHOOK ERROR]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
