import { prisma } from '../prismaClient.js';
export const getInvoices = async (req, res) => {
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
            customerName: i.booking?.customer?.fullname || '-',
            subtotal: i.subtotal,
            tax: i.tax,
            discount: i.discount,
            total: i.total,
            status: i.status,
            createdAt: i.createdAt,
        }));
        res.json(formattedInvoices);
    }
    catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const getInvoiceById = async (req, res) => {
    try {
        const id = req.params.id;
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
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            // @ts-ignore
            bookingCode: invoice.booking?.bookingCode || '-',
            // @ts-ignore
            customerName: invoice.booking?.customer?.fullname || '-',
            // @ts-ignore
            customerPhone: invoice.booking?.customer?.phone || '-',
            // @ts-ignore
            customerAddress: invoice.booking?.customer?.address || '-',
            subtotal: invoice.subtotal,
            tax: invoice.tax,
            discount: invoice.discount,
            total: invoice.total,
            status: invoice.status,
            createdAt: invoice.createdAt,
        });
    }
    catch (error) {
        console.error('Error fetching invoice by id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const createInvoice = async (req, res) => {
    try {
        const { bookingId, subtotal, tax, discount } = req.body;
        const parsedSubtotal = parseFloat(subtotal) || 0;
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
                status: 'UNPAID', // Default status
            },
        });
        res.status(201).json(newInvoice);
    }
    catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const payInvoice = async (req, res) => {
    try {
        const id = req.params.id;
        const { amount, paymentMethod } = req.body;
        const invoice = await prisma.invoice.findUnique({
            where: { id },
        });
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        if (invoice.status === 'PAID') {
            return res.status(400).json({ error: 'Invoice is already paid' });
        }
        const payment = await prisma.payment.create({
            data: {
                invoiceId: id,
                amount: amount !== undefined ? amount : invoice.total,
                paymentMethod,
                paymentDate: new Date(),
                status: 'SUCCESS',
            },
        });
        const updatedInvoice = await prisma.invoice.update({
            where: { id },
            data: {
                status: 'PAID',
            },
        });
        res.json({ payment, invoice: updatedInvoice });
    }
    catch (error) {
        console.error('Error paying invoice:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//# sourceMappingURL=invoiceController.js.map