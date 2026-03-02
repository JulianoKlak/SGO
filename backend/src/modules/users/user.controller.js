'use strict';

const userService = require('./user.service');
const { createUserSchema, updateUserSchema } = require('./user.validation');
const { success } = require('../../utils/response');

const getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll(req.query);
    return success(res, users);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(Number(req.params.id));
    return success(res, user);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await userService.create(data);
    return success(res, user, 'User created', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const user = await userService.update(Number(req.params.id), data);
    return success(res, user, 'User updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await userService.remove(Number(req.params.id));
    return success(res, null, 'User deleted');
  } catch (err) { next(err); }
};

const getMechanics = async (req, res, next) => {
  try {
    const mechanics = await userService.getMechanics();
    return success(res, mechanics);
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove, getMechanics };
