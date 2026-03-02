'use strict';

const { Router } = require('express');
const productController = require('./product.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');

const router = Router();

router.get('/', auth, productController.getAll);
router.get('/:id', auth, productController.getById);
router.post('/', auth, rbac(1), productController.create);
router.put('/:id', auth, rbac(1), productController.update);
router.delete('/:id', auth, rbac(1), productController.remove);

module.exports = router;
