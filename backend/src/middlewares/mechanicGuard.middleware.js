'use strict';

/**
 * Allows only mechanics (type === 2).
 * Use on routes that are exclusively for the mechanic panel.
 */
const mechanicOnly = (req, res, next) => {
  if (!req.user || req.user.type !== 2) {
    return res.status(403).json({ success: false, message: 'Mechanic access only' });
  }
  next();
};

/**
 * Blocks mechanics (type === 2) from accessing admin/user routes.
 */
const onlyMechanic = (req, res, next) => {
  if (req.user && req.user.type === 2) {
    return res.status(403).json({ success: false, message: 'Mechanics cannot access this resource' });
  }
  next();
};

module.exports = { mechanicOnly, onlyMechanic };
