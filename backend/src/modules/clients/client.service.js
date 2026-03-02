'use strict';

const repo = require('./client.repository');

const getAll = (query) => repo.findAll(query);

const getById = async (id) => {
  const client = await repo.findById(id);
  if (!client) throw Object.assign(new Error('Client not found'), { status: 404 });
  return client;
};

const create = (data) => repo.create(data);

const update = async (id, data) => {
  const client = await repo.update(id, data);
  if (!client) throw Object.assign(new Error('Client not found'), { status: 404 });
  return client;
};

const remove = async (id) => {
  const result = await repo.remove(id);
  if (!result) throw Object.assign(new Error('Client not found'), { status: 404 });
  return result;
};

module.exports = { getAll, getById, create, update, remove };
