import { prisma } from '../prismaClient.js';
export const getTechnicians = async (req, res) => {
    try {
        const technicians = await prisma.technician.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const formattedTechnicians = technicians.map((t) => ({
            id: t.id,
            fullname: t.user?.fullname || 'Tanpa Nama',
            phone: t.user?.phone || '-',
            specialty: t.specialty,
            status: t.status,
            createdAt: t.createdAt,
        }));
        res.json(formattedTechnicians);
    }
    catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const createTechnician = async (req, res) => {
    try {
        const { fullname, phone, specialty } = req.body;
        // Tambahkan User terlebih dahulu
        const newUser = await prisma.user.create({
            data: {
                fullname,
                phone,
                role: 'TECHNICIAN',
            },
        });
        // Tambahkan Technician terhubung ke User
        const newTechnician = await prisma.technician.create({
            data: {
                userId: newUser.id,
                specialty,
                status: 'Aktif',
            },
            include: {
                user: true,
            }
        });
        res.status(201).json({
            id: newTechnician.id,
            fullname: newTechnician.user?.fullname,
            phone: newTechnician.user?.phone,
            specialty: newTechnician.specialty,
            status: newTechnician.status,
            createdAt: newTechnician.createdAt,
        });
    }
    catch (error) {
        console.error('Error creating technician:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//# sourceMappingURL=technicianController.js.map