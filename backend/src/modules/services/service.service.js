'use strict';

const repo = require('./service.repository');
const { SystemInfo } = require('../../models');

const STEPS_META_PREFIX = 'service_steps:';

const normaliseSteps = (steps) => {
  if (!Array.isArray(steps)) return [];
  return steps
    .map((step) => {
      if (typeof step === 'string') {
        return { name: step.trim(), description: '' };
      }
      return {
        name: String(step?.name || '').trim(),
        description: String(step?.description || '').trim(),
      };
    })
    .filter((step) => step.name.length > 0);
};

const getStepsMetaKey = (serviceId) => `${STEPS_META_PREFIX}${serviceId}`;

const getServiceSteps = async (serviceId) => {
  const row = await SystemInfo.findOne({ where: { meta_field: getStepsMetaKey(serviceId) } });
  if (!row?.meta_value) return [];
  try {
    const parsed = JSON.parse(row.meta_value);
    return normaliseSteps(parsed);
  } catch {
    return [];
  }
};

const saveServiceSteps = async (serviceId, steps) => {
  const cleanSteps = normaliseSteps(steps);
  const metaField = getStepsMetaKey(serviceId);
  const row = await SystemInfo.findOne({ where: { meta_field: metaField } });

  if (!cleanSteps.length) {
    if (row) await row.destroy();
    return [];
  }

  const metaValue = JSON.stringify(cleanSteps);
  if (row) {
    await row.update({ meta_value: metaValue });
  } else {
    await SystemInfo.create({ meta_field: metaField, meta_value: metaValue });
  }
  return cleanSteps;
};

const getAll = (query) => repo.findAll(query);

const getById = async (id) => {
  const s = await repo.findById(id);
  if (!s) throw Object.assign(new Error('Service not found'), { status: 404 });
  const steps = await getServiceSteps(id);
  return { ...s.toJSON(), steps };
};

const create = async (data) => {
  const { steps = [], ...payload } = data;
  const service = await repo.create(payload);
  const savedSteps = await saveServiceSteps(service.id, steps);
  return { ...service.toJSON(), steps: savedSteps };
};

const update = async (id, data) => {
  const { steps, ...payload } = data;
  const s = await repo.update(id, payload);
  if (!s) throw Object.assign(new Error('Service not found'), { status: 404 });
  const savedSteps = steps !== undefined ? await saveServiceSteps(id, steps) : await getServiceSteps(id);
  return { ...s.toJSON(), steps: savedSteps };
};

const remove = async (id) => {
  const s = await repo.softDelete(id);
  if (!s) throw Object.assign(new Error('Service not found'), { status: 404 });
  await saveServiceSteps(id, []);
  return s;
};

module.exports = { getAll, getById, create, update, remove };
