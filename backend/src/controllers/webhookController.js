import { prisma } from '../prismaClient.js';
export const handlePaymentWebhook = async (req, res) => {
    try {
        // Simulasi payload dari Midtrans/Xendit
        // Biasanya berisi order_id (dalam hal ini invoice ID), transaction_status, dll
        const { order_id, transaction_status, gross_amount, payment_type } = req.body;
        console.log(`[WEBHOOK] Received payment notification for Order ID: ${order_id} with status: ${transaction_status}`);
        if (transaction_status === 'settlement' || transaction_status === 'capture') {
            const invoice = await prisma.invoice.findUnique({
                where: { id: order_id }
            });
            if (invoice && invoice.status !== 'PAID') {
                // Rekam Uang Masuk
                await prisma.payment.create({
                    data: {
                        invoiceId: invoice.id,
                        paymentMethod: payment_type || 'PAYMENT_GATEWAY',
                        amount: invoice.total,
                        paymentDate: new Date(),
                        status: 'SUCCESS',
                    }
                });
                // Update status tagihan otomatis
                await prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { status: 'PAID' }
                });
                console.log(`[WEBHOOK] Invoice ${invoice.invoiceNumber} successfully marked as PAID!`);
            }
        }
        // Selalu balas 200 OK ke pihak Bank/Payment Gateway agar mereka tahu kita sudah menerima notifikasinya
        res.status(200).send('OK');
    }
    catch (error) {
        console.error('[WEBHOOK ERROR]:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//# sourceMappingURL=webhookController.js.map