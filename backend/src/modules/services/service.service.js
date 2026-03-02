'use strict';

const repo = require('./service.repository');

const getAll = (query) => repo.findAll(query);

const getById = async (id) => {
  const s = await repo.findById(id);
  if (!s) throw Object.assign(new Error('Service not found'), { status: 404 });
  return s;
};

const create = (data) => repo.create(data);

const update = async (id, data) => {
  const s = await repo.update(id, data);
  if (!s) throw Object.assign(new Error('Service not found'), { status: 404 });
  return s;
};

const remove = async (id) => {
  const s = await repo.softDelete(id);
  if (!s) throw Object.assign(new Error('Service not found'), { status: 404 });
  return s;
};

module.exports = { getAll, getById, create, update, remove };
