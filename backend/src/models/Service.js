'use strict';

/** Maps the `service` table */
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(15, 2) },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    delete_flag: { type: DataTypes.TINYINT, defaultValue: 0 },
    date_created: { type: DataTypes.DATE },
    date_updated: { type: DataTypes.DATE },
  }, {
    tableName: 'service',
    timestamps: false,
  });

  return Service;
};
