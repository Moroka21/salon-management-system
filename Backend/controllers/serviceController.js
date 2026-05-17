const { Service } = require('../models');
const ApiError = require('../utils/apiError');

const listServices = async (req, res, next) => {
  try {
    res.json(await Service.findAll({ order: [['name', 'ASC']] }));
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const payload = { ...req.body, category: req.body.category === 'Nailstyle' ? 'Nails' : req.body.category };
    res.status(201).json(await Service.create(payload));
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) throw new ApiError(404, 'Service not found');
    const payload = { ...req.body, category: req.body.category === 'Nailstyle' ? 'Nails' : req.body.category };
    await service.update(payload);
    res.json(service);
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) throw new ApiError(404, 'Service not found');
    await service.update({ isActive: false });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { listServices, createService, updateService, deleteService };
