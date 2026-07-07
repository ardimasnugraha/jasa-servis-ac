import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Start seeding...');
    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@crm.com' },
        update: {},
        create: {
            email: 'admin@crm.com',
            fullname: 'Admin Utama',
            password: 'hashed_password',
            role: 'ADMIN',
        },
    });
    // Create Customers
    const customer1 = await prisma.customer.create({
        data: {
            fullname: 'Budi Santoso',
            email: 'budi@example.com',
        },
    });
    const customer2 = await prisma.customer.create({
        data: {
            fullname: 'Siti Aminah',
            email: 'siti@example.com',
        },
    });
    // Create Booking 1 (Selesai hari ini)
    const today = new Date();
    const booking1 = await prisma.booking.create({
        data: {
            customerId: customer1.id,
            bookingDate: today,
            status: 'COMPLETED',
            complaint: 'Cuci AC rutin',
            invoices: {
                create: {
                    total: 150000,
                    status: 'PAID',
                }
            }
        }
    });
    // Create Booking 2 (Pending besok)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const booking2 = await prisma.booking.create({
        data: {
            customerId: customer2.id,
            bookingDate: tomorrow,
            status: 'PENDING',
            complaint: 'Perbaikan kompresor mati',
        }
    });
    // Create Booking 3 (Selesai kemarin)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const booking3 = await prisma.booking.create({
        data: {
            customerId: customer1.id,
            bookingDate: yesterday,
            status: 'COMPLETED',
            complaint: 'Bongkar Pasang AC',
            invoices: {
                create: {
                    total: 400000,
                    status: 'PAID',
                }
            }
        }
    });
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map