'use strict';

const { User } = require('../../models');
const { Op } = require('sequelize');

const SAFE_ATTRS = { exclude: ['password'] };

/**
 * Returns all users, optionally filtering by type.
 * @param {object} [filters]
 */
const findAll = async (filters = {}) => {
  const where = {};
  if (filters.type !== undefined) where.type = filters.type;
  if (filters.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${filters.search}%` } },
      { username: { [Op.like]: `%${filters.search}%` } },
    ];
  }
  return User.findAll({ where, attributes: SAFE_ATTRS });
};

/** @param {number} id */
const findById = async (id) => User.findByPk(id, { attributes: SAFE_ATTRS });

/** @param {object} data */
const create = async (data) => {
  const user = await User.create(data);
  const { password: _pw, ...result } = user.toJSON();
  return result;
};

/**
 * @param {number} id
 * @param {object} data
 */
const update = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(data);
  const { password: _pw, ...result } = user.toJSON();
  return result;
};

/** @param {number} id */
const remove = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
};

module.exports = { findAll, findById, create, update, remove };
