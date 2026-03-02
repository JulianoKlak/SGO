'use strict';

const repo = require('./serviceOrder.repository');
const { generateOrderCode } = require('../../utils/codeGenerator');
const { ServiceOrderProduct, ServiceOrderService, Product, Service } = require('../../models');

const VALID_TRANSITIONS = {
  pending: ['open', 'cancelled'],
  open: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: ['paid', 'in_progress'],
  paid: [],
  cancelled: [],
};

const getAll = (query) => repo.findAll(query);

const getById = async (id) => {
  const order = await repo.findById(id);
  if (!order) throw Object.assign(new Error('Service order not found'), { status: 404 });
  return order;
};

/**
 * Creates a new service order, auto-generating the code.
 * @param {object} data
 */
const createOrder = async (data) => {
  const code = generateOrderCode();
  return repo.create({ ...data, code, date_opened: new Date() });
};

const update = async (id, data) => {
  const order = await repo.update(id, data);
  if (!order) throw Object.assign(new Error('Service order not found'), { status: 404 });
  return order;
};

/**
 * Updates service order status with transition validation.
 * @param {number} id
 * @param {string} newStatus
 */
const updateStatus = async (id, newStatus) => {
  const order = await repo.findById(id);
  if (!order) throw Object.assign(new Error('Service order not found'), { status: 404 });

  const allowed = VALID_TRANSITIONS[order.status] || [];
  if (!allowed.includes(newStatus)) {
    throw Object.assign(
      new Error(`Cannot transition from '${order.status}' to '${newStatus}'`),
      { status: 422 },
    );
  }

  return repo.updateStatus(id, newStatus);
};

const remove = async (id) => {
  const result = await repo.remove(id);
  if (!result) throw Object.assign(new Error('Service order not found'), { status: 404 });
  return result;
};

/**
 * Recalculates and updates the total_amount of a service order.
 * @param {number} orderId
 */
const recalcTotal = async (orderId) => {
  const products = await ServiceOrderProduct.findAll({ where: { service_order_id: orderId }, include: [{ model: Product, as: 'product' }] });
  const services = await ServiceOrderService.findAll({ where: { service_order_id: orderId }, include: [{ model: Service, as: 'service' }] });

  let total = 0;
  for (const op of products) {
    const price = parseFloat(op.price || op.product?.price || 0);
    const qty = op.quantity || 1;
    total += price * qty;
  }
  for (const os of services) {
    total += parseFloat(os.price || os.service?.price || 0);
  }

  await repo.update(orderId, { total_amount: total.toFixed(2) });
};

const addProduct = async (orderId, productId, quantity, price) => {
  // Use product's price if not specified
  if (price === undefined || price === null) {
    const product = await Product.findByPk(productId);
    price = product ? parseFloat(product.price) : 0;
  }
  const record = await repo.addProduct(orderId, productId, quantity, price);
  await recalcTotal(orderId);
  return record;
};

const removeProduct = async (orderId, productId) => {
  const result = await repo.removeProduct(orderId, productId);
  if (!result) throw Object.assign(new Error('Product not in order'), { status: 404 });
  await recalcTotal(orderId);
  return result;
};

const addService = async (orderId, serviceId, price) => {
  if (price === undefined || price === null) {
    const svc = await Service.findByPk(serviceId);
    price = svc ? parseFloat(svc.price) : 0;
  }
  const record = await repo.addService(orderId, serviceId, price);
  await recalcTotal(orderId);
  return record;
};

const removeService = async (orderId, serviceId) => {
  const result = await repo.removeService(orderId, serviceId);
  if (!result) throw Object.assign(new Error('Service not in order'), { status: 404 });
  await recalcTotal(orderId);
  return result;
};

module.exports = {
  getAll, getById, createOrder, update, updateStatus, remove,
  addProduct, removeProduct, addService, removeService,
};
