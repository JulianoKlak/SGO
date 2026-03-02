'use strict';

/** Maps the `system_info` table */
module.exports = (sequelize, DataTypes) => {
  const SystemInfo = sequelize.define('SystemInfo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    meta_field: { type: DataTypes.STRING(100) },
    meta_value: { type: DataTypes.TEXT },
  }, {
    tableName: 'system_info',
    timestamps: false,
  });

  return SystemInfo;
};
