'use strict';

const clientService = require('./client.service');
const { clientSchema, updateClientSchema } = require('./client.validation');
const { success } = require('../../utils/response');

const getAll = async (req, res, next) => {
  try {
    const result = await clientService.getAll(req.query);
    return success(res, result);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const client = await clientService.getById(Number(req.params.id));
    return success(res, client);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = clientSchema.parse(req.body);
    const client = await clientService.create(data);
    return success(res, client, 'Client created', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = updateClientSchema.parse(req.body);
    const client = await clientService.update(Number(req.params.id), data);
    return success(res, client, 'Client updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await clientService.remove(Number(req.params.id));
    return success(res, null, 'Client deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
