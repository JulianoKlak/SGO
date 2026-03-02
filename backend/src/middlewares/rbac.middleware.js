'use strict';

/**
 * RBAC middleware factory.
 * @param {...number} roles - Allowed user types (0=user, 1=admin, 2=mechanic)
 * @returns {Function} Express middleware
 */
const rbac = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.type)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

module.exports = rbac;
