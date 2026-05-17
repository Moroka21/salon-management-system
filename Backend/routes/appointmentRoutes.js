const express = require('express');
const {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  updateStatus,
  cancelAppointment,
  getReceipt,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { appointmentRules, updateAppointmentRules, idParam, statusRules, listRules } = require('../validators/appointmentValidators');

const router = express.Router();

router.use(protect);
router.get('/', listRules, validateRequest, listAppointments);
router.post('/', authorize('Admin', 'Staff', 'Customer'), appointmentRules, validateRequest, createAppointment);
router.get('/:id', idParam, validateRequest, getAppointment);
router.get('/:id/receipt', idParam, validateRequest, getReceipt);
router.put('/:id', authorize('Admin', 'Staff', 'Customer'), idParam, updateAppointmentRules, validateRequest, updateAppointment);
router.patch('/:id/status', authorize('Admin', 'Staff'), statusRules, validateRequest, updateStatus);
router.patch('/:id/cancel', authorize('Customer'), idParam, validateRequest, cancelAppointment);
router.delete('/:id', authorize('Admin'), idParam, validateRequest, deleteAppointment);

module.exports = router;
