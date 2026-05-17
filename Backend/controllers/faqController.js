const { FAQ } = require('../models');

const listFAQs = async (req, res, next) => {
  try {
    res.json(await FAQ.findAll({ where: { isPublished: true }, order: [['category', 'ASC'], ['question', 'ASC']] }));
  } catch (error) {
    next(error);
  }
};

const createFAQ = async (req, res, next) => {
  try {
    res.status(201).json(await FAQ.create(req.body));
  } catch (error) {
    next(error);
  }
};

module.exports = { listFAQs, createFAQ };
