'use strict';

/** Maps the `task` table */
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stage_id: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT },
    user_id: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'blocked'),
      defaultValue: 'pending',
    },
    estimated_time_minutes: { type: DataTypes.INTEGER },
    actual_time_minutes: { type: DataTypes.INTEGER },
    date_started: { type: DataTypes.DATE },
    date_finished: { type: DataTypes.DATE },
  }, {
    tableName: 'task',
    timestamps: false,
  });

  return Task;
};
