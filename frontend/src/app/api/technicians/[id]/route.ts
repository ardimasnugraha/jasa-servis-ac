import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find technician
    const technician = await prisma.technician.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!technician) {
      return NextResponse.json({ error: 'Teknisi tidak ditemukan' }, { status: 404 });
    }

    // 1. Set technicianId to null in all bookings assigned to this technician
    await prisma.booking.updateMany({
      where: { technicianId: id },
      data: { technicianId: null }
    });

    // 2. Set technicianId to null in all service reports
    await prisma.serviceReport.updateMany({
      where: { technicianId: id },
      data: { technicianId: null }
    });

    // 3. Delete the Technician record
    await prisma.technician.delete({
      where: { id }
    });

    // 4. Update associated User role to 'USER' if exists
    if (technician.userId) {
      await prisma.user.update({
        where: { id: technician.userId },
        data: { role: 'USER' }
      });
    }

    return NextResponse.json({ message: 'Teknisi berhasil dipecat' });
  } catch (error) {
    console.error('Error deleting technician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
