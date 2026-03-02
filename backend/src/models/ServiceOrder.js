'use strict';

/** Maps the `service_order` table */
module.exports = (sequelize, DataTypes) => {
  const ServiceOrder = sequelize.define('ServiceOrder', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    client_id: { type: DataTypes.INTEGER },
    vehicle_id: { type: DataTypes.INTEGER },
    user_id: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM('pending', 'open', 'in_progress', 'completed', 'paid', 'cancelled'),
      defaultValue: 'open',
    },
    date_opened: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    date_closed: { type: DataTypes.DATE },
    total_amount: { type: DataTypes.DECIMAL(15, 2) },
    client_contact: { type: DataTypes.STRING(100) },
    client_email: { type: DataTypes.STRING(100) },
    client_address: { type: DataTypes.STRING(255) },
  }, {
    tableName: 'service_order',
    timestamps: false,
  });

  return ServiceOrder;
};
