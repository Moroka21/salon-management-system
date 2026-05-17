const { Op, fn, col, literal } = require('sequelize');
const { Appointment, Payment, Service, User } = require('../models');

const getStats = async (req, res, next) => {
  try {
    const year = Number(req.query.year || new Date().getFullYear());
    const from = new Date(`${year}-01-01T00:00:00.000Z`);
    const to = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const [
      totalUsers,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      approvedAppointments,
      cancelledAppointments,
      revenue,
      monthlyRows,
      yearlyAppointments,
      paidPayments,
      pendingPaymentApprovals,
    ] = await Promise.all([
      User.count(),
      Appointment.count(),
      Appointment.count({ where: { status: 'Completed' } }),
      Appointment.count({ where: { status: 'Pending' } }),
      Appointment.count({ where: { status: 'Approved' } }),
      Appointment.count({ where: { status: 'Cancelled' } }),
      Payment.sum('amount', { where: { status: 'Paid' } }),
      Appointment.findAll({
        attributes: [
          [fn('MONTH', col('start_time')), 'month'],
          [fn('COUNT', col('Appointment.id')), 'appointments'],
          [literal("SUM(CASE WHEN `Appointment`.`status` = 'Completed' THEN 1 ELSE 0 END)"), 'completed'],
        ],
        where: { startTime: { [Op.gte]: from, [Op.lt]: to } },
        group: [fn('MONTH', col('start_time'))],
        raw: true,
      }),
      Appointment.findAll({
        where: { startTime: { [Op.gte]: from, [Op.lt]: to } },
        include: [
          { model: Service, as: 'service', attributes: ['id', 'name', 'category', 'price'] },
          { model: User, as: 'staff', attributes: ['id', 'firstName', 'lastName'] },
        ],
      }),
      Payment.findAll({
        where: { status: 'Paid', paidAt: { [Op.gte]: from, [Op.lt]: to } },
        attributes: ['amount', 'paidAt'],
        raw: true,
      }),
      Payment.count({ where: { status: 'Pending' } }),
    ]);

    const monthlyStats = Array.from({ length: 12 }, (_, index) => {
      const row = monthlyRows.find((item) => Number(item.month) === index + 1);
      const monthRevenue = paidPayments
        .filter((payment) => new Date(payment.paidAt).getMonth() === index)
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      return {
        month: new Date(year, index, 1).toLocaleString('en', { month: 'short' }),
        appointments: Number(row?.appointments || 0),
        completed: Number(row?.completed || 0),
        revenue: monthRevenue,
      };
    });

    const serviceMap = new Map();
    const staffMap = new Map();
    yearlyAppointments.forEach((appointment) => {
      const serviceName = appointment.service?.name || 'Unknown service';
      const serviceEntry = serviceMap.get(serviceName) || {
        name: serviceName,
        category: appointment.service?.category || 'Unknown',
        bookings: 0,
        revenue: 0,
      };
      serviceEntry.bookings += 1;
      if (appointment.status === 'Completed') serviceEntry.revenue += Number(appointment.service?.price || 0);
      serviceMap.set(serviceName, serviceEntry);

      const staffName = appointment.staff ? `${appointment.staff.firstName} ${appointment.staff.lastName}` : 'Unassigned';
      const staffEntry = staffMap.get(staffName) || { name: staffName, bookings: 0, completed: 0, pending: 0, revenue: 0 };
      staffEntry.bookings += 1;
      if (appointment.status === 'Completed') {
        staffEntry.completed += 1;
        staffEntry.revenue += Number(appointment.service?.price || 0);
      }
      if (['Pending', 'Pending Payment Approval'].includes(appointment.status)) staffEntry.pending += 1;
      staffMap.set(staffName, staffEntry);
    });

    const popularServices = [...serviceMap.values()].sort((a, b) => b.bookings - a.bookings).slice(0, 8);
    const popularHairstyles = popularServices.filter((item) => item.category === 'Hairstyle').slice(0, 6);
    const popularNailStyles = popularServices.filter((item) => item.category === 'Nails').slice(0, 6);
    const staffPerformance = [...staffMap.values()].sort((a, b) => b.bookings - a.bookings);

    res.json({
      totalUsers,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      approvedAppointments,
      cancelledAppointments,
      revenue: Number(revenue || 0),
      pendingPaymentApprovals,
      monthlyStats,
      popularServices,
      popularHairstyles,
      popularNailStyles,
      staffPerformance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
