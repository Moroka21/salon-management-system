const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/apiError');

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

const serializeUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

const register = async (req, res, next) => {
  try {
    const isAdminCreate = req.originalUrl.includes('/admin/register');
    const role = isAdminCreate && req.user?.role === 'Admin' ? req.body.role || 'Customer' : 'Customer';
    const fullName = (req.body.name || `${req.body.firstName || ''} ${req.body.lastName || ''}`).trim();
    const [firstName, ...lastNameParts] = fullName.split(/\s+/);

    if (!firstName) throw new ApiError(422, 'Name is required');

    const user = await User.create({
      firstName,
      lastName: lastNameParts.join(' ') || 'Customer',
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role,
    });
    const payload = { user: serializeUser(user) };
    if (!isAdminCreate) payload.token = signToken(user);
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.scope('withPassword').findOne({ where: { email: req.body.email.toLowerCase() } });
    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new ApiError(401, 'Invalid email or password');
    }
    if (!user.isActive) throw new ApiError(403, 'Account is inactive');

    res.json({ user: serializeUser(user), token: signToken(user) });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({ user: serializeUser(req.user) });
};

module.exports = { register, login, me };
