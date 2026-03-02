'use strict';

/** Maps the `task_comments` table */
module.exports = (sequelize, DataTypes) => {
  const TaskComment = sequelize.define('TaskComment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    task_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER },
    comment: { type: DataTypes.TEXT },
    date_created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'task_comments',
    timestamps: false,
  });

  return TaskComment;
};
