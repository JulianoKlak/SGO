'use strict';

/** Maps the `service_order_product` table (composite PK) */
module.exports = (sequelize, DataTypes) => {
  const ServiceOrderProduct = sequelize.define('ServiceOrderProduct', {
    service_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    quantity: { type: DataTypes.INTEGER },
    price: { type: DataTypes.DECIMAL(15, 2) },
  }, {
    tableName: 'service_order_product',
    timestamps: false,
  });

  return ServiceOrderProduct;
};
