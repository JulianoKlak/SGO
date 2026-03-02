'use strict';

const stageService = require('./stage.service');
const { stageSchema, updateStageSchema } = require('./stage.validation');
const { success } = require('../../utils/response');

const getByOrder = async (req, res, next) => {
  try {
    return success(res, await stageService.getByOrder(Number(req.params.orderId)));
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    return success(res, await stageService.getById(Number(req.params.id)));
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = stageSchema.parse(req.body);
    return success(res, await stageService.create(Number(req.params.orderId), data), 'Stage created', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = updateStageSchema.parse(req.body);
    return success(res, await stageService.update(Number(req.params.id), data), 'Stage updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await stageService.remove(Number(req.params.id));
    return success(res, null, 'Stage deleted');
  } catch (err) { next(err); }
};

module.exports = { getByOrder, getById, create, update, remove };
