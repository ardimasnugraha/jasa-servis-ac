import { prisma } from './prismaClient';

/**
 * Updates the status of a technician based on their active/ongoing bookings.
 * An active booking is one where the status is NOT one of ['SELESAI', 'COMPLETED', 'DIBATALKAN', 'CANCELLED', 'DIBATAL'].
 */
export async function updateTechnicianStatus(technicianId: string | null | undefined) {
  if (!technicianId) return;

  try {
    // Find all ongoing/active bookings for this technician
    const activeBookings = await prisma.booking.findMany({
      where: {
        technicianId: technicianId,
        NOT: {
          status: {
            in: ['SELESAI', 'COMPLETED', 'DIBATALKAN', 'CANCELLED', 'DIBATAL'],
          },
        },
      },
    });

    const newStatus = activeBookings.length > 0 ? 'sedang dalam pekerjaan' : 'Aktif';

    await prisma.technician.update({
      where: { id: technicianId },
      data: { status: newStatus },
    });
  } catch (error) {
    console.error(`Error updating technician status for ID ${technicianId}:`, error);
  }
}
