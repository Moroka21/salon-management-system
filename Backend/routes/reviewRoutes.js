const express = require('express');
const { body } = require('express-validator');
const { listReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { idParam } = require('../validators/commonValidators');

const router = express.Router();

router.use(protect);
router.get('/', listReviews);
router.post(
  '/',
  [
    body('appointmentId').isInt({ min: 1 }).withMessage('Valid appointment id is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be from 1 to 5'),
    body('comment').optional({ nullable: true }).trim().isLength({ max: 1000 }).withMessage('Review is too long'),
  ],
  validateRequest,
  createReview
);
router.delete('/:id', idParam, validateRequest, deleteReview);

module.exports = router;
