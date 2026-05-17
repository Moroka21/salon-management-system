const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inventory = sequelize.define(
  'Inventory',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    reorderLevel: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
    location: { type: DataTypes.STRING(120), allowNull: true },
  },
  { tableName: 'inventories' }
);

module.exports = Inventory;
