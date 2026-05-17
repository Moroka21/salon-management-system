const express = require('express');
const { listNotifications, markRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { idParam } = require('../validators/commonValidators');

const router = express.Router();

router.use(protect);
router.get('/', listNotifications);
router.patch('/:id/read', idParam, validateRequest, markRead);

module.exports = router;
