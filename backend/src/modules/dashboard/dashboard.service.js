'use strict';

const { ServiceOrder, Client, User, Stage, Task, sequelize } = require('../../models');
const { Op, fn, col, literal } = require('sequelize');

/**
 * Returns high-level metrics: OS counts by status, total clients, total mechanics, revenue.
 */
const getMetrics = async () => {
  // Service orders by status
  const ordersByStatus = await ServiceOrder.findAll({
    attributes: ['status', [fn('COUNT', col('id')), 'count']],
    group: ['status'],
    raw: true,
  });

  const totalClients = await Client.count();
  const totalMechanics = await User.count({ where: { type: 2, status: 1 } });

  // Revenue from paid/completed orders
  const revenue = await ServiceOrder.findOne({
    attributes: [[fn('SUM', col('total_amount')), 'total']],
    where: { status: { [Op.in]: ['paid', 'completed'] } },
    raw: true,
  });

  return {
    ordersByStatus,
    totalClients,
    totalMechanics,
    totalRevenue: parseFloat(revenue?.total || 0),
  };
};

/**
 * Returns each mechanic with their task completion statistics.
 */
const getMechanicStats = async () => {
  const mechanics = await User.findAll({
    where: { type: 2, status: 1 },
    attributes: ['id', 'name', 'username', 'avatar'],
  });

  const stats = await Promise.all(
    mechanics.map(async (m) => {
      const total = await Task.count({ where: { user_id: m.id } });
      const completed = await Task.count({ where: { user_id: m.id, status: 'completed' } });
      const inProgress = await Task.count({ where: { user_id: m.id, status: 'in_progress' } });
      return {
        ...m.toJSON(),
        tasks: { total, completed, in_progress: inProgress, pending: total - completed - inProgress },
      };
    }),
  );

  return stats;
};

/**
 * Returns each service order with stage completion percentage.
 */
const getOrdersProgress = async () => {
  const orders = await ServiceOrder.findAll({
    where: { status: { [Op.in]: ['open', 'in_progress'] } },
    attributes: ['id', 'code', 'status'],
    include: [{ model: Stage, as: 'stages', attributes: ['id', 'name', 'status'] }],
  });

  return orders.map((o) => {
    const stages = o.stages || [];
    const total = stages.length;
    const completed = stages.filter((s) => s.status === 'completed').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      id: o.id,
      code: o.code,
      status: o.status,
      stages_total: total,
      stages_completed: completed,
      completion_percentage: pct,
    };
  });
};

module.exports = { getMetrics, getMechanicStats, getOrdersProgress };
