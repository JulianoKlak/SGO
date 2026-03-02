'use strict';

/** Maps the `task_images` table */
module.exports = (sequelize, DataTypes) => {
  const TaskImage = sequelize.define('TaskImage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    task_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER },
    file_path: { type: DataTypes.STRING(255) },
    file_name: { type: DataTypes.STRING(255) },
    file_size: { type: DataTypes.INTEGER },
    date_created: { type: DataTypes.DATE },
  }, {
    tableName: 'task_images',
    timestamps: false,
  });

  return TaskImage;
};
