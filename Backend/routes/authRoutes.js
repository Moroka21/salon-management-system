const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { registerRules, loginRules } = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerRules, validateRequest, register);
router.post('/admin/register', protect, authorize('Admin'), registerRules, validateRequest, register);
router.post('/login', loginRules, validateRequest, login);
router.get('/me', protect, me);

module.exports = router;
