'use strict';

const repo = require('./product.repository');

const getAll = (query) => repo.findAll(query);

const getById = async (id) => {
  const p = await repo.findById(id);
  if (!p) throw Object.assign(new Error('Product not found'), { status: 404 });
  return p;
};

const create = (data) => repo.create(data);

const update = async (id, data) => {
  const p = await repo.update(id, data);
  if (!p) throw Object.assign(new Error('Product not found'), { status: 404 });
  return p;
};

const remove = async (id) => {
  const p = await repo.softDelete(id);
  if (!p) throw Object.assign(new Error('Product not found'), { status: 404 });
  return p;
};

module.exports = { getAll, getById, create, update, remove };
