'use strict';

/**
 * Sends a standardised success response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} message
 * @param {number} status
 */
const success = (res, data, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, message, data });

/**
 * Sends a standardised error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} status
 */
const error = (res, message = 'Error', status = 500) =>
  res.status(status).json({ success: false, message });

module.exports = { success, error };
