'use strict';

const {
  ServiceOrder, Client, Vehicle, User,
  Stage, Task, ServiceOrderProduct, ServiceOrderService,
  Product, Service,
} = require('../../models');
const { Op } = require('sequelize');

const findAll = async ({ search, status, page = 1, limit = 20 } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (search) {
    where[Op.or] = [
      { code: { [Op.like]: `%${search}%` } },
    ];
  }
  const offset = (page - 1) * limit;
  const { count, rows } = await ServiceOrder.findAndCountAll({
    where,
    include: [
      { model: Client, as: 'client', attributes: ['id', 'name', 'phone'] },
      { model: Vehicle, as: 'vehicle', attributes: ['id', 'plate', 'model', 'brand'] },
      { model: User, as: 'user', attributes: ['id', 'name', 'username'] },
    ],
    limit: Number(limit),
    offset,
    order: [['id', 'DESC']],
  });
  return { total: count, page: Number(page), limit: Number(limit), data: rows };
};

const findById = (id) =>
  ServiceOrder.findByPk(id, {
    include: [
      { model: Client, as: 'client' },
      { model: Vehicle, as: 'vehicle' },
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      {
        model: Stage, as: 'stages',
        include: [{ model: Task, as: 'tasks', include: [{ model: User, as: 'mechanic', attributes: ['id', 'name'] }] }],
      },
      { model: ServiceOrderProduct, as: 'orderProducts', include: [{ model: Product, as: 'product' }] },
      { model: ServiceOrderService, as: 'orderServices', include: [{ model: Service, as: 'service' }] },
    ],
  });

const create = (data) => ServiceOrder.create(data);

const update = async (id, data) => {
  const order = await ServiceOrder.findByPk(id);
  if (!order) return null;
  return order.update(data);
};

const updateStatus = async (id, status) => {
  const order = await ServiceOrder.findByPk(id);
  if (!order) return null;
  const payload = { status };
  if (status === 'completed' || status === 'paid' || status === 'cancelled') {
    payload.date_closed = new Date();
  }
  return order.update(payload);
};

const remove = async (id) => {
  const order = await ServiceOrder.findByPk(id);
  if (!order) return null;
  await order.destroy();
  return true;
};

const addProduct = async (orderId, productId, quantity, price) => {
  const [record, created] = await ServiceOrderProduct.findOrCreate({
    where: { service_order_id: orderId, product_id: productId },
    defaults: { quantity, price },
  });
  if (!created) await record.update({ quantity, price });
  return record;
};

const removeProduct = async (orderId, productId) => {
  const record = await ServiceOrderProduct.findOne({
    where: { service_order_id: orderId, product_id: productId },
  });
  if (!record) return null;
  await record.destroy();
  return true;
};

const addService = async (orderId, serviceId, price) => {
  const [record, created] = await ServiceOrderService.findOrCreate({
    where: { service_order_id: orderId, service_id: serviceId },
    defaults: { price },
  });
  if (!created) await record.update({ price });
  return { record, created };
};

const removeService = async (orderId, serviceId) => {
  const record = await ServiceOrderService.findOne({
    where: { service_order_id: orderId, service_id: serviceId },
  });
  if (!record) return null;
  await record.destroy();
  return true;
};

module.exports = {
  findAll, findById, create, update, updateStatus, remove,
  addProduct, removeProduct, addService, removeService,
};
