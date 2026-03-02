'use strict';

/** Maps the `vehicle` table */
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    plate: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    model: { type: DataTypes.STRING(100) },
    brand: { type: DataTypes.STRING(100) },
    year: { type: DataTypes.INTEGER },
    client_id: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'vehicle',
    timestamps: false,
  });

  return Vehicle;
};
