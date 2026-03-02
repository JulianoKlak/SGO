'use strict';

const { Product } = require('../../models');
const { Op } = require('sequelize');

const findAll = async ({ search, page = 1, limit = 20 } = {}) => {
  const where = { delete_flag: 0 };
  if (search) where.name = { [Op.like]: `%${search}%` };
  const offset = (page - 1) * limit;
  const { count, rows } = await Product.findAndCountAll({ where, limit: Number(limit), offset });
  return { total: count, page: Number(page), limit: Number(limit), data: rows };
};

const findById = (id) => Product.findOne({ where: { id, delete_flag: 0 } });

const create = (data) => Product.create({ ...data, date_created: new Date() });

const update = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  return product.update({ ...data, date_updated: new Date() });
};

const softDelete = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  return product.update({ delete_flag: 1, date_updated: new Date() });
};

module.exports = { findAll, findById, create, update, softDelete };
