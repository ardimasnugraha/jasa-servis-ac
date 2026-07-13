import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { updateTechnicianStatus } from '@/lib/technicianStatusHelper';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    if (updatedBooking.technicianId) {
      await updateTechnicianStatus(updatedBooking.technicianId);
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
