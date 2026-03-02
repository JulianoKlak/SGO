'use strict';

const repo = require('./vehicle.repository');

const getAll = (query) => repo.findAll(query);

const getById = async (id) => {
  const v = await repo.findById(id);
  if (!v) throw Object.assign(new Error('Vehicle not found'), { status: 404 });
  return v;
};

const create = (data) => repo.create(data);

const update = async (id, data) => {
  const v = await repo.update(id, data);
  if (!v) throw Object.assign(new Error('Vehicle not found'), { status: 404 });
  return v;
};

const remove = async (id) => {
  const result = await repo.remove(id);
  if (!result) throw Object.assign(new Error('Vehicle not found'), { status: 404 });
  return result;
};

module.exports = { getAll, getById, create, update, remove };
