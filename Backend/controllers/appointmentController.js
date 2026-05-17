const { Op } = require('sequelize');
const { sequelize, Appointment, Service, User, Payment, Invoice } = require('../models');
const ApiError = require('../utils/apiError');
const { notifyUser } = require('../services/notificationService');
const { buildInvoiceSnapshot, generateInvoiceNumber } = require('../services/invoiceService');

const appointmentIncludes = [
  { model: User, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
  { model: User, as: 'staff', attributes: ['id', 'firstName', 'lastName', 'email'] },
  { model: Service, as: 'service' },
];

const activeStatuses = ['Pending', 'Pending Payment Approval', 'Approved'];

const validateOperatingHours = (startTime, endTime) => {
  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
  const opens = 8 * 60;
  const closes = 18 * 60;

  if (startMinutes < opens || endMinutes > closes || startTime.toDateString() !== endTime.toDateString()) {
    throw new ApiError(422, 'Bookings are only allowed between 08:00 and 18:00');
  }
};

const checkAvailability = async ({ staffId, startTime, endTime, excludeAppointmentId = null, transaction }) => {
  const overlapWhere = {
    status: { [Op.in]: activeStatuses },
    startTime: { [Op.lt]: endTime },
    endTime: { [Op.gt]: startTime },
  };
  if (excludeAppointmentId) overlapWhere.id = { [Op.ne]: excludeAppointmentId };

  const totalOverlaps = await Appointment.count({ where: overlapWhere, transaction });
  if (totalOverlaps >= 2) {
    throw new ApiError(409, 'This time slot is fully booked. Please choose another time.');
  }

  const staffConflict = await Appointment.findOne({ where: { ...overlapWhere, staffId }, transaction });
  if (staffConflict) throw new ApiError(409, 'Selected staff member is already booked for this time');
};

const resolveAppointmentTimes = async ({ serviceId, startTime }) => {
  const service = await Service.findByPk(serviceId);
  if (!service || !service.isActive) throw new ApiError(404, 'Service not found or inactive');

  const start = new Date(startTime);
  const end = new Date(start.getTime() + service.durationMinutes * 60000);
  if (Number.isNaN(start.getTime())) throw new ApiError(422, 'Appointment start time is invalid');
  validateOperatingHours(start, end);
  return { service, start, end };
};

const ensureReceiptForApprovedAppointment = async ({ appointment, transaction }) => {
  const loadedAppointment =
    appointment.service && appointment.customer && appointment.staff
      ? appointment
      : await Appointment.findByPk(appointment.id, { include: appointmentIncludes, transaction });

  let payment = await Payment.findOne({ where: { appointmentId: appointment.id }, transaction });
  if (!payment) {
    payment = await Payment.create(
      {
        appointmentId: appointment.id,
        customerId: appointment.customerId,
        amount: loadedAppointment.service.price,
        method: 'Card',
        status: 'Paid',
        paidAt: new Date(),
      },
      { transaction }
    );
  } else if (payment.status === 'Pending' && payment.method !== 'Cash') {
    await payment.update({ status: 'Paid', paidAt: new Date() }, { transaction });
  }

  const existingInvoice = await Invoice.findOne({ where: { paymentId: payment.id }, transaction });
  if (existingInvoice || payment.status !== 'Paid') return { payment, invoice: existingInvoice };

  const invoiceData = buildInvoiceSnapshot({ appointment: loadedAppointment, payment, taxRate: Number(process.env.TAX_RATE || 0) });
  const invoice = await Invoice.create(
    {
      paymentId: payment.id,
      appointmentId: appointment.id,
      invoiceNumber: await generateInvoiceNumber(),
      ...invoiceData,
    },
    { transaction }
  );
  return { payment, invoice };
};

const createAppointment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  let committed = false;
  try {
    const customerId = req.user.role === 'Customer' ? req.user.id : req.body.customerId;
    if (!customerId) throw new ApiError(422, 'Customer id is required');

    const customer = await User.findOne({ where: { id: customerId, role: 'Customer', isActive: true }, transaction });
    if (!customer) throw new ApiError(404, 'Active customer account not found');

    const staff = await User.findOne({
      where: { id: req.body.staffId, role: { [Op.in]: ['Admin', 'Staff'] }, isActive: true },
      transaction,
    });
    if (!staff) throw new ApiError(404, 'Active staff member not found');

    const { service, start, end } = await resolveAppointmentTimes(req.body);
    await checkAvailability({ staffId: req.body.staffId, startTime: start, endTime: end, transaction });

    const paymentMethod = req.body.paymentMethod || 'Card';
    const appointment = await Appointment.create(
      {
        customerId,
        staffId: req.body.staffId,
        serviceId: req.body.serviceId,
        startTime: start,
        endTime: end,
        status: paymentMethod === 'Cash' ? 'Pending Payment Approval' : 'Pending',
        notes: req.body.notes,
      },
      { transaction }
    );

    if (paymentMethod === 'Cash') {
      await Payment.create(
        {
          appointmentId: appointment.id,
          customerId,
          amount: service.price,
          method: 'Cash',
          status: 'Pending',
          paidAt: null,
        },
        { transaction }
      );
    }

    await transaction.commit();
    committed = true;

    await Promise.all([
      notifyUser({
        userId: customerId,
        appointmentId: appointment.id,
        type: 'AppointmentBooked',
        title: 'Booking request received',
        message:
          paymentMethod === 'Cash'
            ? `Your cash booking request for ${start.toISOString()} is pending payment approval.`
            : `Your appointment request for ${start.toISOString()} is pending admin approval.`,
        email: true,
      }),
      notifyUser({
        userId: req.body.staffId,
        appointmentId: appointment.id,
        type: 'AppointmentBooked',
        title: 'New pending booking',
        message: `A customer requested an appointment on ${start.toISOString()}.`,
      }),
    ]);

    const created = await Appointment.findByPk(appointment.id, { include: appointmentIncludes });
    res.status(201).json(created);
  } catch (error) {
    if (!committed) await transaction.rollback();
    next(error);
  }
};

const listAppointments = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.from || req.query.to) {
      where.startTime = {};
      if (req.query.from) where.startTime[Op.gte] = new Date(req.query.from);
      if (req.query.to) where.startTime[Op.lte] = new Date(req.query.to);
    }
    if (req.user.role === 'Customer') where.customerId = req.user.id;
    if (req.user.role === 'Staff') where.staffId = req.user.id;

    const appointments = await Appointment.findAll({
      where,
      include: appointmentIncludes,
      order: [['startTime', 'ASC']],
    });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, { include: appointmentIncludes });
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    if (req.user.role === 'Customer' && appointment.customerId !== req.user.id) throw new ApiError(403, 'Forbidden');
    if (req.user.role === 'Staff' && appointment.staffId !== req.user.id) throw new ApiError(403, 'Forbidden');
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  let committed = false;
  try {
    const appointment = await Appointment.findByPk(req.params.id, { transaction });
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    if (req.user.role === 'Customer' && appointment.customerId !== req.user.id) throw new ApiError(403, 'Forbidden');

    const serviceId = req.body.serviceId || appointment.serviceId;
    const staffId = req.body.staffId || appointment.staffId;
    const startTime = req.body.startTime || appointment.startTime;
    const { start, end } = await resolveAppointmentTimes({ serviceId, startTime });

    await checkAvailability({ staffId, startTime: start, endTime: end, excludeAppointmentId: appointment.id, transaction });

    await appointment.update(
      { staffId, serviceId, startTime: start, endTime: end, notes: req.body.notes ?? appointment.notes },
      { transaction }
    );
    await transaction.commit();
    committed = true;

    res.json(await Appointment.findByPk(appointment.id, { include: appointmentIncludes }));
  } catch (error) {
    if (!committed) await transaction.rollback();
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  let committed = false;
  try {
    const appointment = await Appointment.findByPk(req.params.id, { transaction });
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    const nextStatus = req.body.status;
    if (['Approved', 'Pending Payment Approval', 'Cancelled'].includes(nextStatus) && req.user.role !== 'Admin') {
      throw new ApiError(403, 'Only admins can approve or reject bookings');
    }
    if (nextStatus === 'Completed' && !['Admin', 'Staff'].includes(req.user.role)) {
      throw new ApiError(403, 'Only admin or staff can complete bookings');
    }
    if (req.user.role === 'Staff' && appointment.staffId !== req.user.id) throw new ApiError(403, 'Forbidden');
    if (nextStatus === 'Approved' && appointment.status === 'Pending Payment Approval') {
      const cashPayment = await Payment.findOne({ where: { appointmentId: appointment.id, method: 'Cash', status: 'Pending' }, transaction });
      if (cashPayment) throw new ApiError(409, 'Approve the pending cash payment before approving this booking');
    }

    await appointment.update({ status: nextStatus }, { transaction });
    if (nextStatus === 'Approved') {
      await ensureReceiptForApprovedAppointment({ appointment, transaction });
    }
    await transaction.commit();
    committed = true;

    if (nextStatus === 'Cancelled') {
      await notifyUser({
        userId: appointment.customerId,
        appointmentId: appointment.id,
        type: 'AppointmentCancelled',
        title: 'Appointment cancelled',
        message: 'Your salon appointment has been cancelled.',
        email: true,
      });
    }
    if (nextStatus === 'Approved') {
      await notifyUser({
        userId: appointment.customerId,
        appointmentId: appointment.id,
        type: 'AppointmentBooked',
        title: 'Appointment approved',
        message: 'Your appointment has been approved. Your receipt is ready in your dashboard.',
        email: true,
      });
    }

    res.json(await Appointment.findByPk(appointment.id, { include: appointmentIncludes }));
  } catch (error) {
    if (!committed) await transaction.rollback();
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    if (req.user.role !== 'Customer' || appointment.customerId !== req.user.id) {
      throw new ApiError(403, 'Only the customer who made this booking can cancel it here');
    }
    if (!['Pending', 'Pending Payment Approval'].includes(appointment.status)) {
      throw new ApiError(409, 'Only pending bookings can be cancelled by customers');
    }

    await appointment.update({ status: 'Cancelled' });
    await notifyUser({
      userId: appointment.customerId,
      appointmentId: appointment.id,
      type: 'AppointmentCancelled',
      title: 'Booking cancelled',
      message: 'Your pending appointment request has been cancelled.',
      email: true,
    });

    res.json(await Appointment.findByPk(appointment.id, { include: appointmentIncludes }));
  } catch (error) {
    next(error);
  }
};

const getReceipt = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, { include: appointmentIncludes });
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    if (req.user.role === 'Customer' && appointment.customerId !== req.user.id) throw new ApiError(403, 'Forbidden');
    if (!['Approved', 'Completed'].includes(appointment.status)) {
      throw new ApiError(409, 'Receipt is available after the booking is approved');
    }

    const payment = await Payment.findOne({ where: { appointmentId: appointment.id } });
    const invoice = payment ? await Invoice.findOne({ where: { paymentId: payment.id } }) : null;

    res.json({
      bookingId: appointment.id,
      receiptNumber: invoice?.invoiceNumber || `JJ-${String(appointment.id).padStart(6, '0')}`,
      customerName: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
      serviceName: appointment.service.name,
      staffName: `${appointment.staff.firstName} ${appointment.staff.lastName}`,
      dateTime: appointment.startTime,
      price: Number(appointment.service.price),
      status: appointment.status,
      paymentMethod: payment?.method || 'Not recorded',
      paymentStatus: payment?.status || 'Pending',
      salon: {
        name: 'J&J Beauty Bar',
        phone: '0639390931 / 0608185119',
        email: 'mamcyrachidi@icloud.com',
        address: 'Strydkraal B Mabokotswane House 20057',
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  updateStatus,
  cancelAppointment,
  getReceipt,
  deleteAppointment,
};
