const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define(
  'Payment',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    appointmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    customerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0.01 } },
    method: {
      type: DataTypes.ENUM('Cash', 'Card', 'EFT', 'Mobile'),
      allowNull: false,
      defaultValue: 'Cash',
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Rejected', 'Failed', 'Refunded'),
      allowNull: false,
      defaultValue: 'Paid',
    },
    paidAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    reference: { type: DataTypes.STRING(120), allowNull: true },
  },
  { tableName: 'payments' }
);

module.exports = Payment;
