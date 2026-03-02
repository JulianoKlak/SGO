'use strict';

/** Maps the `user` table */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100) },
    phone: { type: DataTypes.STRING(20) },
    avatar: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    type: { type: DataTypes.TINYINT, defaultValue: 0 },
    last_login: { type: DataTypes.DATE },
    date_added: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    date_updated: { type: DataTypes.DATE },
  }, {
    tableName: 'user',
    timestamps: false,
  });

  return User;
};
