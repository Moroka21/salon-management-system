const express = require('express');
const {
  listProducts,
  createProduct,
  updateProduct,
  listSuppliers,
  createSupplier,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { idParam, productRules, supplierRules } = require('../validators/commonValidators');

const router = express.Router();

router.use(protect, authorize('Admin', 'Staff'));
router.get('/products', listProducts);
router.post('/products', productRules, validateRequest, createProduct);
router.put('/products/:id', idParam, productRules, validateRequest, updateProduct);
router.get('/suppliers', listSuppliers);
router.post('/suppliers', supplierRules, validateRequest, createSupplier);

module.exports = router;
