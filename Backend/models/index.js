const sequelize = require('../config/db');
const User = require('./User');
const Service = require('./Service');
const Appointment = require('./Appointment');
const Payment = require('./Payment');
const Invoice = require('./Invoice');
const Notification = require('./Notification');
const Product = require('./Product');
const Inventory = require('./Inventory');
const Supplier = require('./Supplier');
const ProductSupplier = require('./ProductSupplier');
const FAQ = require('./FAQ');
const Review = require('./Review');

User.hasMany(Appointment, { as: 'customerAppointments', foreignKey: 'customerId' });
User.hasMany(Appointment, { as: 'staffAppointments', foreignKey: 'staffId' });
Appointment.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });
Appointment.belongsTo(User, { as: 'staff', foreignKey: 'staffId' });

Service.hasMany(Appointment, { foreignKey: 'serviceId' });
Appointment.belongsTo(Service, { as: 'service', foreignKey: 'serviceId' });

Appointment.hasOne(Payment, { foreignKey: 'appointmentId' });
Payment.belongsTo(Appointment, { as: 'appointment', foreignKey: 'appointmentId' });
User.hasMany(Payment, { as: 'customerPayments', foreignKey: 'customerId' });
Payment.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });

Payment.hasOne(Invoice, { foreignKey: 'paymentId' });
Invoice.belongsTo(Payment, { as: 'payment', foreignKey: 'paymentId' });
Appointment.hasOne(Invoice, { foreignKey: 'appointmentId' });
Invoice.belongsTo(Appointment, { as: 'appointment', foreignKey: 'appointmentId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Appointment.hasMany(Notification, { foreignKey: 'appointmentId' });
Notification.belongsTo(Appointment, { as: 'appointment', foreignKey: 'appointmentId' });

User.hasMany(Review, { as: 'reviews', foreignKey: 'customerId' });
Review.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });
Appointment.hasOne(Review, { foreignKey: 'appointmentId' });
Review.belongsTo(Appointment, { as: 'appointment', foreignKey: 'appointmentId' });
Service.hasMany(Review, { foreignKey: 'serviceId' });
Review.belongsTo(Service, { as: 'service', foreignKey: 'serviceId' });

Product.hasOne(Inventory, { foreignKey: 'productId', onDelete: 'CASCADE' });
Inventory.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
Product.belongsToMany(Supplier, { through: ProductSupplier, foreignKey: 'productId', otherKey: 'supplierId' });
Supplier.belongsToMany(Product, { through: ProductSupplier, foreignKey: 'supplierId', otherKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Service,
  Appointment,
  Payment,
  Invoice,
  Notification,
  Product,
  Inventory,
  Supplier,
  ProductSupplier,
  FAQ,
  Review,
};
