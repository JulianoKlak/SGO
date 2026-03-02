'use strict';

const taskService = require('./task.service');
const { taskSchema, updateTaskSchema, updateStatusSchema, addCommentSchema } = require('./task.validation');
const { success } = require('../../utils/response');
const upload = require('../../utils/upload');
const path = require('path');

const getByStage = async (req, res, next) => {
  try {
    return success(res, await taskService.getByStage(Number(req.params.stageId)));
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    return success(res, await taskService.getById(Number(req.params.id)));
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = taskSchema.parse(req.body);
    return success(res, await taskService.create(Number(req.params.stageId), data), 'Task created', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = updateTaskSchema.parse(req.body);
    return success(res, await taskService.update(Number(req.params.id), data), 'Task updated');
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = updateStatusSchema.parse(req.body);
    const result = await taskService.updateTaskStatus(
      Number(req.params.id),
      status,
      req.user.id,
      req.user.type,
    );
    return success(res, result, 'Task status updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await taskService.remove(Number(req.params.id));
    return success(res, null, 'Task deleted');
  } catch (err) { next(err); }
};

// ── Comments ──────────────────────────────────────────────────────────────────

const getComments = async (req, res, next) => {
  try {
    return success(res, await taskService.getComments(Number(req.params.id)));
  } catch (err) { next(err); }
};

const addComment = async (req, res, next) => {
  try {
    const { comment } = addCommentSchema.parse(req.body);
    const result = await taskService.addComment(Number(req.params.id), req.user.id, comment);
    return success(res, result, 'Comment added', 201);
  } catch (err) { next(err); }
};

// ── Images ────────────────────────────────────────────────────────────────────

const getImages = async (req, res, next) => {
  try {
    return success(res, await taskService.getImages(Number(req.params.id)));
  } catch (err) { next(err); }
};

const addImage = async (req, res, next) => {
  try {
    if (!req.file) throw Object.assign(new Error('No file uploaded'), { status: 400 });
    const fileData = {
      file_path: req.file.path,
      file_name: req.file.filename,
      file_size: req.file.size,
    };
    const result = await taskService.addImage(Number(req.params.id), req.user.id, fileData);
    return success(res, result, 'Image uploaded', 201);
  } catch (err) { next(err); }
};

// ── Mechanic panel ────────────────────────────────────────────────────────────

const getMechanicOrders = async (req, res, next) => {
  try {
    const tasks = await taskService.getMechanicTasks(req.user.id);
    return success(res, tasks);
  } catch (err) { next(err); }
};

const completeTask = async (req, res, next) => {
  try {
    const result = await taskService.completeTask(
      Number(req.params.id),
      req.user.id,
      req.user.type,
    );
    return success(res, result, 'Task completed');
  } catch (err) { next(err); }
};

module.exports = {
  getByStage, getById, create, update, updateStatus, remove,
  getComments, addComment, getImages, addImage,
  getMechanicOrders, completeTask,
};
