'use strict';

/**
 * Generates a unique service order code.
 * @returns {string} e.g. "OS-20240101-A1B2"
 */
const generateOrderCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `OS-${date}-${random}`;
};

module.exports = { generateOrderCode };
