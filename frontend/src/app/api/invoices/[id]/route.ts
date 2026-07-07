import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            customer: true,
          }
        }
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      bookingCode: invoice.booking?.bookingCode || '-',
      customerName: invoice.booking?.customer?.fullname || '-',
      customerPhone: invoice.booking?.customer?.phone || '-',
      customerAddress: invoice.booking?.customer?.address || '-',
      subtotal: invoice.subtotal ? Number(invoice.subtotal) : 0,
      tax: invoice.tax ? Number(invoice.tax) : 0,
      discount: invoice.discount ? Number(invoice.discount) : 0,
      total: invoice.total ? Number(invoice.total) : 0,
      status: invoice.status,
      createdAt: invoice.createdAt,
    });
  } catch (error) {
    console.error('Error fetching invoice by id:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
