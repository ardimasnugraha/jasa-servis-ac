import { prisma } from '../prismaClient.js';
export const getServiceReports = async (req, res) => {
    try {
        const reports = await prisma.serviceReport.findMany({
            include: {
                booking: {
                    include: {
                        customer: true,
                    }
                },
                technician: {
                    include: {
                        user: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const formattedReports = reports.map((r) => ({
            id: r.id,
            bookingCode: r.booking?.bookingCode || '-',
            customerName: r.booking?.customer?.fullname || 'Tanpa Nama',
            technicianName: r.technician?.user?.fullname || '-',
            diagnosis: r.diagnosis,
            actionTaken: r.actionTaken,
            totalCost: r.totalCost,
            createdAt: r.createdAt,
        }));
        res.json(formattedReports);
    }
    catch (error) {
        console.error('Error fetching service reports:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const createServiceReport = async (req, res) => {
    try {
        const { bookingId, technicianId, diagnosis, actionTaken, totalCost } = req.body;
        const newReport = await prisma.serviceReport.create({
            data: {
                bookingId,
                technicianId: technicianId || null,
                diagnosis,
                actionTaken,
                totalCost: totalCost ? parseFloat(totalCost) || 0 : 0,
            },
        });
        // Update booking status
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'SELESAI' },
        });
        res.status(201).json(newReport);
    }
    catch (error) {
        console.error('Error creating service report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//# sourceMappingURL=serviceController.js.map