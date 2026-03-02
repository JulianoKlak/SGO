'use strict';

const dashboardService = require('./dashboard.service');
const { success } = require('../../utils/response');

const getMetrics = async (req, res, next) => {
  try {
    return success(res, await dashboardService.getMetrics());
  } catch (err) { next(err); }
};

const getMechanics = async (req, res, next) => {
  try {
    return success(res, await dashboardService.getMechanicStats());
  } catch (err) { next(err); }
};

const getOrdersProgress = async (req, res, next) => {
  try {
    return success(res, await dashboardService.getOrdersProgress());
  } catch (err) { next(err); }
};

module.exports = { getMetrics, getMechanics, getOrdersProgress };
