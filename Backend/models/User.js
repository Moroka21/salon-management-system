const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING(80), allowNull: false },
    lastName: { type: DataTypes.STRING(80), allowNull: false },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('Admin', 'Staff', 'Customer'),
      allowNull: false,
      defaultValue: 'Customer',
    },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: 'users',
    defaultScope: { attributes: { exclude: ['password'] } },
    scopes: { withPassword: { attributes: { include: ['password'] } } },
    hooks: {
      beforeCreate: async (user) => {
        user.email = user.email.toLowerCase();
        user.password = await bcrypt.hash(user.password, Number(process.env.BCRYPT_ROUNDS || 12));
      },
      beforeUpdate: async (user) => {
        if (user.changed('email')) user.email = user.email.toLowerCase();
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, Number(process.env.BCRYPT_ROUNDS || 12));
        }
      },
    },
  }
);

User.prototype.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
