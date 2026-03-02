'use strict';

/** Maps the `service_order_service` table (composite PK) */
module.exports = (sequelize, DataTypes) => {
  const ServiceOrderService = sequelize.define('ServiceOrderService', {
    service_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    price: { type: DataTypes.DECIMAL(15, 2) },
  }, {
    tableName: 'service_order_service',
    timestamps: false,
  });

  return ServiceOrderService;
};
