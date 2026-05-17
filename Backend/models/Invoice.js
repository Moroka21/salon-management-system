const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Invoice = sequelize.define(
  'Invoice',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    paymentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
    appointmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    invoiceNumber: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    tax: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.ENUM('Issued', 'Void'), allowNull: false, defaultValue: 'Issued' },
    issuedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    billingSnapshot: { type: DataTypes.JSON, allowNull: false },
  },
  { tableName: 'invoices' }
);

module.exports = Invoice;
