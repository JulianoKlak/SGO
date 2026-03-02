'use strict';

/** Maps the `inventory` table */
module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_date: { type: DataTypes.DATE },
    date_created: { type: DataTypes.DATE },
    date_updated: { type: DataTypes.DATE },
  }, {
    tableName: 'inventory',
    timestamps: false,
  });

  return Inventory;
};
