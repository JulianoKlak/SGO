'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const config = require('../../config/env');

const SALT_ROUNDS = 10;

/**
 * Authenticates a user and returns a signed JWT.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
const login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  if (user.status !== 1) throw Object.assign(new Error('Account is disabled'), { status: 403 });

  // Update last login
  await user.update({ last_login: new Date() });

  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    type: user.type,
    email: user.email,
  };

  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

  return { token, user: payload };
};

/**
 * Registers a new user.
 * @param {object} data
 * @returns {Promise<object>} Created user (without password)
 */
const register = async (data) => {
  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await User.create({ ...data, password: hashed, date_added: new Date() });
  const { password: _pw, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};

/**
 * Returns the authenticated user's profile (without password).
 * @param {number} userId
 */
const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
};

/**
 * Updates authenticated user's profile fields.
 * @param {number} userId
 * @param {object} data
 */
const updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  // Prevent type/status escalation through profile update
  const { password, type, status, ...allowed } = data;

  if (password) {
    allowed.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  allowed.date_updated = new Date();
  await user.update(allowed);

  const { password: _pw, ...result } = user.toJSON();
  return result;
};

module.exports = { login, register, getProfile, updateProfile };
