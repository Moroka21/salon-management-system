const express = require('express');
const { listServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { idParam, serviceRules } = require('../validators/commonValidators');

const router = express.Router();

router.get('/', listServices);
router.post('/', protect, authorize('Admin'), serviceRules, validateRequest, createService);
router.put('/:id', protect, authorize('Admin'), idParam, serviceRules, validateRequest, updateService);
router.delete('/:id', protect, authorize('Admin'), idParam, validateRequest, deleteService);

module.exports = router;
