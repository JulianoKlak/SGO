'use strict';

const orderService = require('./serviceOrder.service');
const {
  createOrderSchema, updateOrderSchema,
  addProductSchema, addServiceSchema, updateStatusSchema,
} = require('./serviceOrder.validation');
const { success } = require('../../utils/response');

const getAll = async (req, res, next) => {
  try {
    return success(res, await orderService.getAll(req.query));
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    return success(res, await orderService.getById(Number(req.params.id)));
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const payload = {
      ...data,
      user_id: data.user_id ?? req.user?.id,
    };
    if (!payload.user_id) {
      throw Object.assign(new Error('Authenticated user is required to create service order'), { status: 401 });
    }
    return success(res, await orderService.createOrder(payload), 'Service order created', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = updateOrderSchema.parse(req.body);
    return success(res, await orderService.update(Number(req.params.id), data), 'Order updated');
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = updateStatusSchema.parse(req.body);
    return success(res, await orderService.updateStatus(Number(req.params.id), status), 'Status updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await orderService.remove(Number(req.params.id));
    return success(res, null, 'Service order deleted');
  } catch (err) { next(err); }
};

const addProduct = async (req, res, next) => {
  try {
    const { product_id, quantity, price } = addProductSchema.parse(req.body);
    const result = await orderService.addProduct(Number(req.params.id), product_id, quantity, price);
    return success(res, result, 'Product added to order');
  } catch (err) { next(err); }
};

const removeProduct = async (req, res, next) => {
  try {
    await orderService.removeProduct(Number(req.params.id), Number(req.params.productId));
    return success(res, null, 'Product removed from order');
  } catch (err) { next(err); }
};

const addService = async (req, res, next) => {
  try {
    const { service_id, price } = addServiceSchema.parse(req.body);
    const result = await orderService.addService(Number(req.params.id), service_id, price);
    return success(res, result, 'Service added to order');
  } catch (err) { next(err); }
};

const removeService = async (req, res, next) => {
  try {
    await orderService.removeService(Number(req.params.id), Number(req.params.serviceId));
    return success(res, null, 'Service removed from order');
  } catch (err) { next(err); }
};

module.exports = {
  getAll, getById, create, update, updateStatus, remove,
  addProduct, removeProduct, addService, removeService,
};
