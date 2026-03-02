'use strict';

const bcrypt = require('bcrypt');
const repo = require('./user.repository');

const SALT_ROUNDS = 10;

const getAll = (filters) => repo.findAll(filters);

const getById = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
};

/**
 * Creates a user, hashing the password before saving.
 * @param {object} data
 */
const create = async (data) => {
  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  return repo.create({ ...data, password: hashed, date_added: new Date() });
};

/**
 * Updates a user. If password is supplied it will be hashed.
 * @param {number} id
 * @param {object} data
 */
const update = async (id, data) => {
  const payload = { ...data, date_updated: new Date() };
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
  }
  const user = await repo.update(id, payload);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
};

const remove = async (id) => {
  const result = await repo.remove(id);
  if (!result) throw Object.assign(new Error('User not found'), { status: 404 });
  return result;
};

/** Returns all mechanics (type === 2) */
const getMechanics = () => repo.findAll({ type: 2 });

module.exports = { getAll, getById, create, update, remove, getMechanics };
