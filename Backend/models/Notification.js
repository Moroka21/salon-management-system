const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define(
  'Notification',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    appointmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    type: {
      type: DataTypes.ENUM('AppointmentBooked', 'AppointmentCancelled', 'AppointmentReminder', 'PaymentReceived'),
      allowNull: false,
    },
    title: { type: DataTypes.STRING(160), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    channel: { type: DataTypes.ENUM('InApp', 'Email'), allowNull: false, defaultValue: 'InApp' },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    sentAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'notifications' }
);

module.exports = Notification;
