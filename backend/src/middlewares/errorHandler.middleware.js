'use strict';

const { ZodError } = require('zod');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Global error handler middleware.
 * Handles Zod, Sequelize, JWT, and generic errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err.message || err);

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  // Sequelize validation / unique constraint
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors ? err.errors.map((e) => ({ field: e.path, message: e.message })) : [],
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  // Generic error
  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
