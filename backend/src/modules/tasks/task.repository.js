'use strict';

const { Task, TaskComment, TaskImage, User, Stage } = require('../../models');

const findAllByStage = (stageId) =>
  Task.findAll({
    where: { stage_id: stageId },
    include: [{ model: User, as: 'mechanic', attributes: ['id', 'name'] }],
  });

const findById = (id) =>
  Task.findByPk(id, {
    include: [
      { model: User, as: 'mechanic', attributes: ['id', 'name'] },
      { model: TaskComment, as: 'comments', include: [{ model: User, as: 'author', attributes: ['id', 'name'] }] },
      { model: TaskImage, as: 'images', include: [{ model: User, as: 'uploader', attributes: ['id', 'name'] }] },
    ],
  });

const create = (data) => Task.create(data);

const update = async (id, data) => {
  const task = await Task.findByPk(id);
  if (!task) return null;
  return task.update(data);
};

const updateStatus = async (id, status) => {
  const task = await Task.findByPk(id);
  if (!task) return null;
  const payload = { status };
  if (status === 'in_progress' && !task.date_started) payload.date_started = new Date();
  if (status === 'completed') payload.date_finished = new Date();
  return task.update(payload);
};

const remove = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) return null;
  await task.destroy();
  return true;
};

const getComments = (taskId) =>
  TaskComment.findAll({
    where: { task_id: taskId },
    include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
    order: [['date_created', 'ASC']],
  });

const addComment = (taskId, userId, comment) =>
  TaskComment.create({ task_id: taskId, user_id: userId, comment, date_created: new Date() });

const getImages = (taskId) =>
  TaskImage.findAll({
    where: { task_id: taskId },
    include: [{ model: User, as: 'uploader', attributes: ['id', 'name'] }],
  });

const addImage = (taskId, userId, fileData) =>
  TaskImage.create({ task_id: taskId, user_id: userId, ...fileData, date_created: new Date() });

/**
 * Returns true if all tasks in a stage are completed.
 * @param {number} stageId
 */
const checkAllCompleted = async (stageId) => {
  const tasks = await Task.findAll({ where: { stage_id: stageId } });
  if (!tasks.length) return false;
  return tasks.every((t) => t.status === 'completed');
};

module.exports = {
  findAllByStage, findById, create, update, updateStatus, remove,
  getComments, addComment, getImages, addImage, checkAllCompleted,
};
