const { sequelize, Appointment, Payment, Invoice, User, Service } = require('../models');
const ApiError = require('../utils/apiError');
const { buildInvoiceSnapshot, generateInvoiceNumber } = require('../services/invoiceService');
const { notifyUser } = require('../services/notificationService');

const createInvoiceForPayment = async ({ appointment, payment, transaction }) => {
  const existingInvoice = await Invoice.findOne({ where: { paymentId: payment.id }, transaction });
  if (existingInvoice) return existingInvoice;
  const invoiceData = buildInvoiceSnapshot({ appointment, payment, taxRate: Number(process.env.TAX_RATE || 0) });
  return Invoice.create(
    {
      paymentId: payment.id,
      appointmentId: appointment.id,
      invoiceNumber: await generateInvoiceNumber(),
      ...invoiceData,
    },
    { transaction }
  );
};

const recordPayment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  let committed = false;
  try {
    const appointment = await Appointment.findByPk(req.body.appointmentId, {
      include: [
        { model: User, as: 'customer' },
        { model: User, as: 'staff' },
        { model: Service, as: 'service' },
      ],
      transaction,
    });
    if (!appointment) throw new ApiError(404, 'Appointment not found');

    const existingPayment = await Payment.findOne({ where: { appointmentId: appointment.id }, transaction });
    if (existingPayment) throw new ApiError(409, 'Payment already exists for this appointment');

    const payment = await Payment.create(
      {
        appointmentId: appointment.id,
        customerId: appointment.customerId,
        amount: appointment.service.price,
        method: req.body.method,
        reference: req.body.reference,
        status: 'Paid',
      },
      { transaction }
    );

    const invoice = await createInvoiceForPayment({ appointment, payment, transaction });

    await appointment.update({ status: 'Completed' }, { transaction });
    await transaction.commit();
    committed = true;

    await notifyUser({
      userId: appointment.customerId,
      appointmentId: appointment.id,
      type: 'PaymentReceived',
      title: 'Payment received',
      message: `Payment of ${payment.amount} was received. Invoice ${invoice.invoiceNumber} is ready.`,
      email: true,
    });

    res.status(201).json({ payment, invoice });
  } catch (error) {
    if (!committed) await transaction.rollback();
    next(error);
  }
};

const listPayments = async (req, res, next) => {
  try {
    const where = req.user.role === 'Customer' ? { customerId: req.user.id } : {};
    const payments = await Payment.findAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Appointment, as: 'appointment', include: [{ model: Service, as: 'service' }, { model: User, as: 'staff' }] },
      ],
      order: [['paidAt', 'DESC']],
    });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

const approvePayment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  let committed = false;
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Appointment, as: 'appointment', include: [{ model: User, as: 'customer' }, { model: User, as: 'staff' }, { model: Service, as: 'service' }] }],
      transaction,
    });
    if (!payment) throw new ApiError(404, 'Payment not found');
    if (payment.status !== 'Pending') throw new ApiError(409, 'Only pending payments can be approved');

    await payment.update({ status: 'Paid', paidAt: new Date() }, { transaction });
    await payment.appointment.update({ status: 'Approved' }, { transaction });
    const invoice = await createInvoiceForPayment({ appointment: payment.appointment, payment, transaction });
    await transaction.commit();
    committed = true;

    await notifyUser({
      userId: payment.customerId,
      appointmentId: payment.appointmentId,
      type: 'PaymentReceived',
      title: 'Cash payment approved',
      message: `Your payment was approved. Receipt ${invoice.invoiceNumber} is ready.`,
      email: true,
    });

    res.json({ payment, invoice });
  } catch (error) {
    if (!committed) await transaction.rollback();
    next(error);
  }
};

const rejectPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id, { include: [{ model: Appointment, as: 'appointment' }] });
    if (!payment) throw new ApiError(404, 'Payment not found');
    await payment.update({ status: 'Rejected' });
    await payment.appointment.update({ status: 'Cancelled' });
    await notifyUser({
      userId: payment.customerId,
      appointmentId: payment.appointmentId,
      type: 'AppointmentCancelled',
      title: 'Cash payment rejected',
      message: 'Your cash payment was rejected and the booking was cancelled.',
      email: true,
    });
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

const listInvoices = async (req, res, next) => {
  try {
    const include = [
      { model: Payment, as: 'payment', include: [{ model: User, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email'] }] },
      { model: Appointment, as: 'appointment', include: [{ model: Service, as: 'service' }, { model: User, as: 'staff' }] },
    ];
    const where = {};
    if (req.user.role === 'Customer') {
      const payments = await Payment.findAll({ where: { customerId: req.user.id }, attributes: ['id'] });
      where.paymentId = payments.map((payment) => payment.id);
    }
    res.json(await Invoice.findAll({ where, include, order: [['issuedAt', 'DESC']] }));
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, { include: [{ model: Payment, as: 'payment' }] });
    if (!invoice) throw new ApiError(404, 'Invoice not found');
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

module.exports = { recordPayment, listPayments, getInvoice, listInvoices, approvePayment, rejectPayment };
