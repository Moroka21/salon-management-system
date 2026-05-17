const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid id is required')];

const serviceRules = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('category').optional().isIn(['Hairstyle', 'Nails']).withMessage('Invalid service category'),
  body('imageUrl').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Image URL must be valid'),
  body('durationMinutes').isInt({ min: 5 }).withMessage('Duration must be at least 5 minutes'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').optional({ nullable: true }).trim(),
];

const paymentRules = [
  body('appointmentId').isInt({ min: 1 }).withMessage('Valid appointment id is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Payment amount must be greater than zero'),
  body('method').isIn(['Cash', 'Card', 'EFT', 'Mobile']).withMessage('Invalid payment method'),
  body('reference').optional({ nullable: true }).trim().isLength({ max: 120 }).withMessage('Reference is too long'),
];

const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('unitCost').optional().isFloat({ min: 0 }).withMessage('Unit cost must be positive'),
  body('retailPrice').optional().isFloat({ min: 0 }).withMessage('Retail price must be positive'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be zero or more'),
  body('reorderLevel').optional().isInt({ min: 0 }).withMessage('Reorder level must be zero or more'),
  body('supplierIds').optional().isArray().withMessage('Supplier ids must be an array'),
];

const supplierRules = [
  body('name').trim().notEmpty().withMessage('Supplier name is required'),
  body('email').optional({ nullable: true }).isEmail().withMessage('Supplier email must be valid'),
];

module.exports = { idParam, serviceRules, paymentRules, productRules, supplierRules };
