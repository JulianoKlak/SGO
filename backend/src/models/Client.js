'use strict';

/** Maps the `client` table exactly */
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    cpf: { type: DataTypes.STRING(20) },
    phone: { type: DataTypes.STRING(20) },
    homephone: { type: DataTypes.STRING(20) },
    fleet_number: { type: DataTypes.STRING(30) },
    state: { type: DataTypes.STRING(50) },
    city: { type: DataTypes.STRING(100) },
    customer_report: { type: DataTypes.TEXT },
    email: { type: DataTypes.STRING(100) },
    address: { type: DataTypes.STRING(255) },
  }, {
    tableName: 'client',
    timestamps: false,
  });

  return Client;
};
