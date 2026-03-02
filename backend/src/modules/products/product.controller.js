'use strict';

const productService = require('./product.service');
const { productSchema, updateProductSchema } = require('./product.validation');
const { success } = require('../../utils/response');

const getAll = async (req, res, next) => {
  try {
    return success(res, await productService.getAll(req.query));
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    return success(res, await productService.getById(Number(req.params.id)));
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = productSchema.parse(req.body);
    return success(res, await productService.create(data), 'Product created', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = updateProductSchema.parse(req.body);
    return success(res, await productService.update(Number(req.params.id), data), 'Product updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await productService.remove(Number(req.params.id));
    return success(res, null, 'Product deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
