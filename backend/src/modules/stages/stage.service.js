'use strict';

const repo = require('./stage.repository');
const { ServiceOrder } = require('../../models');

const getByOrder = (serviceOrderId) => repo.findAllByOrder(serviceOrderId);

const getById = async (id) => {
  const stage = await repo.findById(id);
  if (!stage) throw Object.assign(new Error('Stage not found'), { status: 404 });
  return stage;
};

const create = (serviceOrderId, data) =>
  repo.create({ ...data, service_order_id: serviceOrderId });

const update = async (id, data) => {
  const stage = await repo.update(id, data);
  if (!stage) throw Object.assign(new Error('Stage not found'), { status: 404 });
  return stage;
};

const remove = async (id) => {
  const result = await repo.remove(id);
  if (!result) throw Object.assign(new Error('Stage not found'), { status: 404 });
  return result;
};

/**
 * Checks if all stages in a service order are completed and, if so,
 * updates the service order status to 'completed'.
 * @param {number} serviceOrderId
 */
const checkAndUpdateOrderStatus = async (serviceOrderId) => {
  const allDone = await repo.checkAllCompleted(serviceOrderId);
  if (allDone) {
    const order = await ServiceOrder.findByPk(serviceOrderId);
    if (order && order.status === 'in_progress') {
      await order.update({ status: 'completed', date_closed: new Date() });
    }
  }
};

module.exports = { getByOrder, getById, create, update, remove, checkAndUpdateOrderStatus };
