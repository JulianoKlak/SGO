'use strict';

const { Vehicle, Client } = require('../../models');

const findAll = async ({ client_id } = {}) => {
  const where = {};
  if (client_id) where.client_id = client_id;
  return Vehicle.findAll({ where, include: [{ model: Client, as: 'client' }] });
};

const findById = async (id) =>
  Vehicle.findByPk(id, { include: [{ model: Client, as: 'client' }] });

const create = (data) => Vehicle.create(data);

const update = async (id, data) => {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) return null;
  return vehicle.update(data);
};

const remove = async (id) => {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) return null;
  await vehicle.destroy();
  return true;
};

module.exports = { findAll, findById, create, update, remove };
