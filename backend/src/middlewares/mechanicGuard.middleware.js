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
 * Blocks mechanics (type === 2) from accessing admin/user-only routes.
 * Alias: `onlyMechanic` kept for backwards compatibility.
 */
const blockMechanics = (req, res, next) => {
  if (req.user && req.user.type === 2) {
    return res.status(403).json({ success: false, message: 'Mechanics cannot access this resource' });
  }
  next();
};

const onlyMechanic = blockMechanics;

module.exports = { mechanicOnly, blockMechanics, onlyMechanic };
