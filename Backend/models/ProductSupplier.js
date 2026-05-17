const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProductSupplier = sequelize.define(
  'ProductSupplier',
  {
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true },
    supplierId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true },
    supplierSku: { type: DataTypes.STRING(80), allowNull: true },
    leadTimeDays: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 7 },
  },
  { tableName: 'product_suppliers' }
);

module.exports = ProductSupplier;
