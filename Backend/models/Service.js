const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define(
  'Service',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    category: {
      type: DataTypes.ENUM('Hairstyle', 'Nails'),
      allowNull: false,
      defaultValue: 'Hairstyle',
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true },
    durationMinutes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 60,
      validate: { min: 5 },
    },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: 'services' }
);

module.exports = Service;
