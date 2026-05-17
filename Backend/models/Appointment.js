const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define(
  'Appointment',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    customerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    staffId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    serviceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('Pending', 'Pending Payment Approval', 'Approved', 'Cancelled', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'appointments',
    indexes: [
      { fields: ['staff_id', 'start_time', 'end_time'] },
      { fields: ['customer_id', 'start_time'] },
    ],
  }
);

module.exports = Appointment;
