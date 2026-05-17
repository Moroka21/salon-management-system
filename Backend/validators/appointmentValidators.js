const { body, param, query } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid appointment id is required')];

const appointmentRules = [
  body('customerId').optional().isInt({ min: 1 }).withMessage('Valid customer id is required'),
  body('staffId').isInt({ min: 1 }).withMessage('Valid staff id is required'),
  body('serviceId').isInt({ min: 1 }).withMessage('Valid service id is required'),
  body('startTime').isISO8601().withMessage('Start time must be a valid ISO date').custom((value) => {
    if (new Date(value) <= new Date()) throw new Error('Appointment start time must be in the future');
    return true;
  }),
  body('notes').optional({ nullable: true }).trim().isLength({ max: 2000 }).withMessage('Notes are too long'),
  body('paymentMethod').optional().isIn(['Cash', 'Card']).withMessage('Invalid payment method'),
];

const updateAppointmentRules = [
  body('customerId').optional().isInt({ min: 1 }).withMessage('Valid customer id is required'),
  body('staffId').optional().isInt({ min: 1 }).withMessage('Valid staff id is required'),
  body('serviceId').optional().isInt({ min: 1 }).withMessage('Valid service id is required'),
  body('startTime').optional().isISO8601().withMessage('Start time must be a valid ISO date').custom((value) => {
    if (new Date(value) <= new Date()) throw new Error('Appointment start time must be in the future');
    return true;
  }),
  body('notes').optional({ nullable: true }).trim().isLength({ max: 2000 }).withMessage('Notes are too long'),
  body('paymentMethod').optional().isIn(['Cash', 'Card']).withMessage('Invalid payment method'),
];

const statusRules = [
  ...idParam,
  body('status').isIn(['Pending', 'Pending Payment Approval', 'Approved', 'Cancelled', 'Completed']).withMessage('Invalid appointment status'),
];

const listRules = [
  query('status').optional().isIn(['Pending', 'Pending Payment Approval', 'Approved', 'Cancelled', 'Completed']).withMessage('Invalid status filter'),
  query('from').optional().isISO8601().withMessage('From date must be valid'),
  query('to').optional().isISO8601().withMessage('To date must be valid'),
];

module.exports = { idParam, appointmentRules, updateAppointmentRules, statusRules, listRules };
