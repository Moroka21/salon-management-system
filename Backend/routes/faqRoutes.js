const express = require('express');
const { body } = require('express-validator');
const { listFAQs, createFAQ } = require('../controllers/faqController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', listFAQs);
router.post(
  '/',
  protect,
  authorize('Admin'),
  [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
  ],
  validateRequest,
  createFAQ
);

module.exports = router;
