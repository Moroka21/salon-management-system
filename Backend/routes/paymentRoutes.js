const express = require('express');
const { recordPayment, listPayments, getInvoice, listInvoices, approvePayment, rejectPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { idParam, paymentRules } = require('../validators/commonValidators');

const router = express.Router();

router.use(protect);
router.get('/', listPayments);
router.post('/', authorize('Admin', 'Staff'), paymentRules, validateRequest, recordPayment);
router.get('/invoices', listInvoices);
router.get('/invoices/:id', idParam, validateRequest, getInvoice);
router.patch('/:id/approve', authorize('Admin'), idParam, validateRequest, approvePayment);
router.patch('/:id/reject', authorize('Admin'), idParam, validateRequest, rejectPayment);

module.exports = router;
