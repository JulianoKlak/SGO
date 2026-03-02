'use strict';

const svcService = require('./service.service');
const { serviceSchema, updateServiceSchema } = require('./service.validation');
const { success } = require('../../utils/response');

const getAll = async (req, res, next) => {
  try {
    return success(res, await svcService.getAll(req.query));
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    return success(res, await svcService.getById(Number(req.params.id)));
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = serviceSchema.parse(req.body);
    return success(res, await svcService.create(data), 'Service created', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = updateServiceSchema.parse(req.body);
    return success(res, await svcService.update(Number(req.params.id), data), 'Service updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await svcService.remove(Number(req.params.id));
    return success(res, null, 'Service deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
