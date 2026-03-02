'use strict';

const vehicleService = require('./vehicle.service');
const { vehicleSchema, updateVehicleSchema } = require('./vehicle.validation');
const { success } = require('../../utils/response');

const getAll = async (req, res, next) => {
  try {
    const result = await vehicleService.getAll(req.query);
    return success(res, result);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getById(Number(req.params.id));
    return success(res, vehicle);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = vehicleSchema.parse(req.body);
    const vehicle = await vehicleService.create(data);
    return success(res, vehicle, 'Vehicle created', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = updateVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.update(Number(req.params.id), data);
    return success(res, vehicle, 'Vehicle updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await vehicleService.remove(Number(req.params.id));
    return success(res, null, 'Vehicle deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
