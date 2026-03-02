'use strict';

const { Stage, Task, User } = require('../../models');

const findAllByOrder = (serviceOrderId) =>
  Stage.findAll({
    where: { service_order_id: serviceOrderId },
    include: [{
      model: Task, as: 'tasks',
      include: [{ model: User, as: 'mechanic', attributes: ['id', 'name'] }],
    }],
    order: [['execution_order', 'ASC']],
  });

const findById = (id) =>
  Stage.findByPk(id, {
    include: [{
      model: Task, as: 'tasks',
      include: [{ model: User, as: 'mechanic', attributes: ['id', 'name'] }],
    }],
  });

const create = (data) => Stage.create(data);

const update = async (id, data) => {
  const stage = await Stage.findByPk(id);
  if (!stage) return null;
  return stage.update(data);
};

const remove = async (id) => {
  const stage = await Stage.findByPk(id);
  if (!stage) return null;
  await stage.destroy();
  return true;
};

/**
 * Returns true if all stages in a service order are completed.
 * @param {number} serviceOrderId
 */
const checkAllCompleted = async (serviceOrderId) => {
  const stages = await Stage.findAll({ where: { service_order_id: serviceOrderId } });
  if (!stages.length) return false;
  return stages.every((s) => s.status === 'completed');
};

module.exports = { findAllByOrder, findById, create, update, remove, checkAllCompleted };
