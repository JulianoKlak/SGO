'use strict';

const { Router } = require('express');
const c = require('./serviceOrder.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');

const router = Router();

router.get('/', auth, c.getAll);
router.get('/:id', auth, c.getById);
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.patch('/:id/status', auth, c.updateStatus);
router.delete('/:id', auth, rbac(1), c.remove);

// Products on order
router.post('/:id/products', auth, c.addProduct);
router.delete('/:id/products/:productId', auth, c.removeProduct);

// Services on order
router.post('/:id/services', auth, c.addService);
router.delete('/:id/services/:serviceId', auth, c.removeService);

module.exports = router;
