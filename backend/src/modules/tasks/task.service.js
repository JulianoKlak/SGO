'use strict';

const repo = require('./task.repository');
const { Stage, ServiceOrder, Task, Vehicle, Client } = require('../../models');
const { Op } = require('sequelize');
const stageRepo = require('../stages/stage.repository');

const getByStage = (stageId) => repo.findAllByStage(stageId);

const getById = async (id) => {
  const task = await repo.findById(id);
  if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });
  return task;
};

const create = (stageId, data) => repo.create({ ...data, stage_id: stageId });

const update = async (id, data) => {
  const task = await repo.update(id, data);
  if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });
  return task;
};

const remove = async (id) => {
  const result = await repo.remove(id);
  if (!result) throw Object.assign(new Error('Task not found'), { status: 404 });
  return result;
};

/**
 * Updates task status with business rules:
 * - Mechanic (type 2): can only set in_progress or completed (cannot undo completed).
 * - Admin/user (type 0,1): can change to any status.
 * After completing: cascade checks stage → service_order.
 *
 * @param {number} taskId
 * @param {string} status
 * @param {number} userId
 * @param {number} userType  0=user,1=admin,2=mechanic
 */
const updateTaskStatus = async (taskId, status, userId, userType) => {
  const task = await repo.findById(taskId);
  if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });

  // Mechanic restrictions
  if (userType === 2) {
    if (!['in_progress', 'completed'].includes(status)) {
      throw Object.assign(new Error('Mechanics can only set tasks to in_progress or completed'), { status: 403 });
    }
    if (task.status === 'completed') {
      throw Object.assign(new Error('Mechanics cannot undo a completed task'), { status: 403 });
    }
  }

  const updatedTask = await repo.updateStatus(taskId, status);

  // Cascade on completion
  if (status === 'completed') {
    await _cascadeOnTaskComplete(task.stage_id);
  }

  return updatedTask;
};

/**
 * Alias used by mechanic panel – always marks as completed and enforces mechanic rules.
 * @param {number} taskId
 * @param {number} userId
 * @param {number} userType
 */
const completeTask = (taskId, userId, userType) =>
  updateTaskStatus(taskId, 'completed', userId, userType);

/**
 * Checks if all tasks in the stage are done; if so completes the stage and
 * then checks if all stages of the parent order are done.
 * @param {number} stageId
 */
const _cascadeOnTaskComplete = async (stageId) => {
  const allTasksDone = await repo.checkAllCompleted(stageId);
  if (!allTasksDone) return;

  const stage = await Stage.findByPk(stageId);
  if (!stage || stage.status === 'completed') return;

  await stage.update({ status: 'completed' });

  // Check parent order
  const allStagesDone = await stageRepo.checkAllCompleted(stage.service_order_id);
  if (allStagesDone) {
    const order = await ServiceOrder.findByPk(stage.service_order_id);
    if (order && order.status === 'in_progress') {
      await order.update({ status: 'completed', date_closed: new Date() });
    }
  }
};

// ── Comments ──────────────────────────────────────────────────────────────────

const getComments = async (taskId) => {
  await getById(taskId); // ensure task exists
  return repo.getComments(taskId);
};

const addComment = async (taskId, userId, comment) => {
  await getById(taskId);
  return repo.addComment(taskId, userId, comment);
};

// ── Images ────────────────────────────────────────────────────────────────────

const getImages = async (taskId) => {
  await getById(taskId);
  return repo.getImages(taskId);
};

const addImage = async (taskId, userId, fileData) => {
  await getById(taskId);
  return repo.addImage(taskId, userId, fileData);
};

/**
 * Returns all tasks assigned to a mechanic across all service orders.
 * @param {number} userId
 */
const getMechanicOrders = async (userId) => {
  const orders = await ServiceOrder.findAll({
    where: {
      status: { [Op.in]: ['pending', 'open', 'in_progress', 'completed'] },
    },
    include: [
      { model: Vehicle, as: 'vehicle', attributes: ['id', 'plate', 'model', 'brand', 'year'] },
      { model: Client, as: 'client', attributes: ['id', 'name'] },
      {
        model: Stage,
        as: 'stages',
        include: [{
          model: Task,
          as: 'tasks',
          where: { [Op.or]: [{ user_id: userId }, { user_id: null }] },
          required: false,
        }],
      },
    ],
    order: [['date_opened', 'DESC'], [{ model: Stage, as: 'stages' }, 'execution_order', 'ASC']],
  });

  return orders
    .map((order) => {
      const json = order.toJSON();
      json.stages = (json.stages || []).map((stage) => ({
        ...stage,
        tasks: (stage.tasks || []).sort((a, b) => a.id - b.id),
      }));
      return json;
    })
    .filter((order) => (order.stages || []).some((stage) => (stage.tasks || []).length > 0));
};

const startMechanicOrder = async (orderId) => {
  const order = await ServiceOrder.findByPk(orderId);
  if (!order) throw Object.assign(new Error('Service order not found'), { status: 404 });
  if (['completed', 'paid', 'cancelled'].includes(order.status)) {
    throw Object.assign(new Error('This service order cannot be started'), { status: 422 });
  }

  const stages = await Stage.findAll({ where: { service_order_id: orderId }, attributes: ['id'] });
  const stageIds = stages.map((s) => s.id);
  if (stageIds.length) {
    await Task.update(
      { status: 'pending' },
      { where: { stage_id: { [Op.in]: stageIds }, status: 'blocked' } },
    );
  }

  if (order.status !== 'in_progress') {
    await order.update({ status: 'in_progress' });
  }
  return order;
};

const blockMechanicOrder = async (orderId) => {
  const order = await ServiceOrder.findByPk(orderId);
  if (!order) throw Object.assign(new Error('Service order not found'), { status: 404 });
  if (['completed', 'paid', 'cancelled'].includes(order.status)) {
    throw Object.assign(new Error('This service order cannot be blocked'), { status: 422 });
  }

  const stages = await Stage.findAll({ where: { service_order_id: orderId }, attributes: ['id'] });
  const stageIds = stages.map((s) => s.id);
  if (stageIds.length) {
    await Task.update(
      { status: 'blocked' },
      { where: { stage_id: { [Op.in]: stageIds }, status: { [Op.in]: ['pending', 'in_progress'] } } },
    );
  }
  return order;
};

module.exports = {
  getByStage, getById, create, update, remove,
  updateTaskStatus, completeTask,
  getComments, addComment, getImages, addImage,
  getMechanicOrders, startMechanicOrder, blockMechanicOrder,
};
