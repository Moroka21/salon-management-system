const app = require('./app');
const { sequelize } = require('./models');
const seedInitialData = require('./seeders/seedInitialData');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required in your environment');
    }

    await sequelize.authenticate();
    await sequelize.query(
      "ALTER TABLE appointments MODIFY status ENUM('Booked','Pending','Pending Payment Approval','Approved','Cancelled','Completed') NOT NULL DEFAULT 'Pending'"
    ).catch(() => {});
    await sequelize.query(
      "ALTER TABLE payments MODIFY status ENUM('Pending','Paid','Rejected','Failed','Refunded') NOT NULL DEFAULT 'Paid'"
    ).catch(() => {});
    await sequelize.query("ALTER TABLE payments ADD COLUMN customer_id INT UNSIGNED NULL AFTER appointment_id").catch(() => {});
    await sequelize.query("UPDATE appointments SET status = 'Approved' WHERE status = 'Booked'").catch(() => {});
    await sequelize.sync({ alter: process.env.DB_ALTER === 'true' });
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`Salon API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
