import { prisma } from '../prismaClient.js';
export const getCustomers = async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(customers);
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const createCustomer = async (req, res) => {
    try {
        const { fullname, email, phone, address } = req.body;
        const newCustomer = await prisma.customer.create({
            data: {
                fullname,
                email,
                phone,
                address,
            },
        });
        res.status(201).json(newCustomer);
    }
    catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//# sourceMappingURL=customerController.js.map