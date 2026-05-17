const { Appointment, Review, Service, User } = require('../models');
const ApiError = require('../utils/apiError');

const reviewIncludes = [
  { model: User, as: 'customer', attributes: ['id', 'firstName', 'lastName'] },
  { model: Service, as: 'service' },
  { model: Appointment, as: 'appointment' },
];

const listReviews = async (req, res, next) => {
  try {
    const where = req.user?.role === 'Customer' ? { customerId: req.user.id } : {};
    res.json(await Review.findAll({ where, include: reviewIncludes, order: [['createdAt', 'DESC']] }));
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.body.appointmentId, { include: [{ model: Service, as: 'service' }] });
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    if (appointment.customerId !== req.user.id) throw new ApiError(403, 'You can only review your own booking');
    if (appointment.status !== 'Completed') throw new ApiError(409, 'Reviews are available after a booking is completed');

    const review = await Review.create({
      customerId: req.user.id,
      appointmentId: appointment.id,
      serviceId: appointment.serviceId,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    res.status(201).json(await Review.findByPk(review.id, { include: reviewIncludes }));
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) throw new ApiError(404, 'Review not found');
    if (req.user.role !== 'Admin' && review.customerId !== req.user.id) throw new ApiError(403, 'Forbidden');
    await review.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { listReviews, createReview, deleteReview };
