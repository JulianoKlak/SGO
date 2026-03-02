'use strict';

const authService = require('./auth.service');
const { loginSchema, registerSchema } = require('./auth.validation');
const { success, error } = require('../../utils/response');

const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.username, data.password);
    return success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);
    return success(res, user, 'User registered', 201);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    return success(res, user, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register, getProfile, updateProfile };
