import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { getCustomers, createCustomer } from '../controllers/customerController.js';
import { getBookings, createBooking, updateBookingStatus } from '../controllers/bookingController.js';
import { getTechnicians, createTechnician } from '../controllers/technicianController.js';
import { getServiceReports, createServiceReport } from '../controllers/serviceController.js';
import { getInvoices, createInvoice, payInvoice, getInvoiceById } from '../controllers/invoiceController.js';
import { handlePaymentWebhook } from '../controllers/webhookController.js';
import { getPayments } from '../controllers/paymentController.js';
import { getFinancialReport } from '../controllers/reportController.js';
import { login, register } from '../controllers/authController.js';
const router = Router();
// AUTHENTICATION
router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/dashboard/summary', getDashboardSummary);
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);
router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/technicians', getTechnicians);
router.post('/technicians', createTechnician);
router.get('/service-reports', getServiceReports);
router.post('/service-reports', createServiceReport);
router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);
router.get('/invoices/:id', getInvoiceById);
router.post('/invoices/:id/pay', payInvoice);
router.get('/payments', getPayments);
router.get('/reports/financial', getFinancialReport);
// WEBHOOK ROUTE
router.post('/webhooks/payment', handlePaymentWebhook);
export default router;
//# sourceMappingURL=api.js.map