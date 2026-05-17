const { ValidationError, UniqueConstraintError } = require('sequelize');

const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      message: 'Duplicate record',
      errors: err.errors.map((item) => ({ field: item.path, message: item.message })),
    });
  }

  if (err instanceof ValidationError) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: err.errors.map((item) => ({ field: item.path, message: item.message })),
    });
  }

  return res.status(statusCode).json({
    message: err.message || 'Internal server error',
    details: err.details || undefined,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
