const { Invoice } = require('../models');

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Invoice.count({
    where: {
      invoiceNumber: {
        [require('sequelize').Op.like]: `INV-${year}-%`,
      },
    },
  });
  return `INV-${year}-${String(count + 1).padStart(6, '0')}`;
};

const buildInvoiceSnapshot = ({ appointment, payment, taxRate = 0 }) => {
  const subtotal = Number(payment.amount);
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return {
    subtotal,
    tax,
    total,
    billingSnapshot: {
      customer: {
        id: appointment.customer.id,
        name: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
        email: appointment.customer.email,
      },
      staff: {
        id: appointment.staff.id,
        name: `${appointment.staff.firstName} ${appointment.staff.lastName}`,
      },
      service: {
        id: appointment.service.id,
        name: appointment.service.name,
        price: Number(appointment.service.price),
      },
      appointment: {
        id: appointment.id,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      },
      payment: {
        id: payment.id,
        method: payment.method,
        reference: payment.reference,
        paidAt: payment.paidAt,
      },
    },
  };
};

module.exports = { generateInvoiceNumber, buildInvoiceSnapshot };
