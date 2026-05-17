const { sequelize, Product, Inventory, Supplier } = require('../models');
const ApiError = require('../utils/apiError');

const listProducts = async (req, res, next) => {
  try {
    res.json(await Product.findAll({ include: [Inventory, Supplier], order: [['name', 'ASC']] }));
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await Product.create(req.body, { transaction });
    await Inventory.create(
      {
        productId: product.id,
        quantity: req.body.quantity || 0,
        reorderLevel: req.body.reorderLevel || 5,
        location: req.body.location,
      },
      { transaction }
    );
    if (req.body.supplierIds?.length) await product.setSuppliers(req.body.supplierIds, { transaction });
    await transaction.commit();
    res.status(201).json(await Product.findByPk(product.id, { include: [Inventory, Supplier] }));
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findByPk(req.params.id, { transaction });
    if (!product) throw new ApiError(404, 'Product not found');
    await product.update(req.body, { transaction });
    if (req.body.quantity !== undefined || req.body.reorderLevel !== undefined || req.body.location !== undefined) {
      await Inventory.update(
        { quantity: req.body.quantity, reorderLevel: req.body.reorderLevel, location: req.body.location },
        { where: { productId: product.id }, transaction }
      );
    }
    if (req.body.supplierIds) await product.setSuppliers(req.body.supplierIds, { transaction });
    await transaction.commit();
    res.json(await Product.findByPk(product.id, { include: [Inventory, Supplier] }));
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const listSuppliers = async (req, res, next) => {
  try {
    res.json(await Supplier.findAll({ include: [Product], order: [['name', 'ASC']] }));
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    res.status(201).json(await Supplier.create(req.body));
  } catch (error) {
    next(error);
  }
};

module.exports = { listProducts, createProduct, updateProduct, listSuppliers, createSupplier };
