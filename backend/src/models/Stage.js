'use strict';

/** Maps the `stage` table */
module.exports = (sequelize, DataTypes) => {
  const Stage = sequelize.define('Stage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    service_order_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: false },
    execution_order: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      defaultValue: 'pending',
    },
  }, {
    tableName: 'stage',
    timestamps: false,
  });

  return Stage;
};
