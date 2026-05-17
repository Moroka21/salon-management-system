const express = require('express');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.patch(
  '/me',
  protect,
  [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2 to 50 characters'),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2 to 50 characters'),
    body('phone').optional({ nullable: true }).trim().isLength({ min: 7, max: 20 }).withMessage('Phone number must be 7 to 20 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ details: errors.array() });

      const updates = ['firstName', 'lastName', 'phone'].reduce((nextUpdates, key) => {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) nextUpdates[key] = req.body[key];
        return nextUpdates;
      }, {});
      const user = await User.findByPk(req.user.id);
      await user.update(updates);
      const safeUser = user.toJSON();
      delete safeUser.passwordHash;
      res.json(safeUser);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', protect, async (req, res, next) => {
  try {
    if (req.user.role === 'Customer' && req.query.role !== 'Staff') {
      return res.status(403).json({ message: 'Customers can only list staff members' });
    }
    if (!['Admin', 'Staff', 'Customer'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const where = req.query.role ? { role: req.query.role } : {};
    if (req.query.role === 'Staff') where.role = { [Op.in]: ['Admin', 'Staff'] };
    res.json(await User.findAll({ where, order: [['firstName', 'ASC']] }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
