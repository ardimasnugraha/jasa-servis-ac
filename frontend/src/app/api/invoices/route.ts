import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { getAutoPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        booking: {
          include: {
            customer: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedInvoices = invoices.map((i) => ({
      id: i.id,
      invoiceNumber: i.invoiceNumber,
      bookingCode: i.booking?.bookingCode || '-',
      customerId: i.booking?.customerId || null,
      customerName: i.booking?.customer?.fullname || '-',
      subtotal: i.subtotal ? Number(i.subtotal) : 0,
      tax: i.tax ? Number(i.tax) : 0,
      discount: i.discount ? Number(i.discount) : 0,
      total: i.total ? Number(i.total) : 0,
      status: i.status,
      createdAt: i.createdAt,
    }));

    return NextResponse.json(formattedInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { bookingId, subtotal, tax, discount } = await request.json();

    let parsedSubtotal = parseFloat(subtotal) || 0;
    if (parsedSubtotal === 0 && bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      });
      if (booking) {
        parsedSubtotal = getAutoPrice(booking.complaint || booking.bookingCode);
      }
    }
    const parsedTax = parseFloat(tax) || 0;
    const parsedDiscount = parseFloat(discount) || 0;
    const total = parsedSubtotal + parsedTax - parsedDiscount;
    
    // Generate Invoice Number (Format: INV-YYYYMMDD-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
    const invoiceNumber = `INV-${dateStr}-${randomStr}`;

    const newInvoice = await prisma.invoice.create({
      data: {
        bookingId,
        invoiceNumber,
        subtotal: parsedSubtotal,
        tax: parsedTax,
        discount: parsedDiscount,
        total,
        status: 'UNPAID',
      },
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
