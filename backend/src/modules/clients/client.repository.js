'use strict';

const { Client, Vehicle } = require('../../models');
const { Op } = require('sequelize');

/**
 * Returns all clients with optional search (name/cpf) and pagination.
 * @param {object} options
 */
const findAll = async ({ search, page = 1, limit = 20 } = {}) => {
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { cpf: { [Op.like]: `%${search}%` } },
    ];
  }
  const offset = (page - 1) * limit;
  const { count, rows } = await Client.findAndCountAll({ where, limit: Number(limit), offset });
  return { total: count, page: Number(page), limit: Number(limit), data: rows };
};

/** @param {number} id - includes associated vehicles */
const findById = async (id) =>
  Client.findByPk(id, { include: [{ model: Vehicle, as: 'vehicles' }] });

/** @param {object} data */
const create = (data) => Client.create(data);

/**
 * @param {number} id
 * @param {object} data
 */
const update = async (id, data) => {
  const client = await Client.findByPk(id);
  if (!client) return null;
  return client.update(data);
};

/** @param {number} id */
const remove = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) return null;
  await client.destroy();
  return true;
};

module.exports = { findAll, findById, create, update, remove };
