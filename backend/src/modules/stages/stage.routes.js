'use strict';

const { Router } = require('express');
const stageController = require('./stage.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');

const router = Router();

// Nested under service-orders
router.get('/service-orders/:orderId/stages', auth, stageController.getByOrder);
router.post('/service-orders/:orderId/stages', auth, stageController.create);

// Standalone stage routes
router.get('/stages/:id', auth, stageController.getById);
router.put('/stages/:id', auth, stageController.update);
router.delete('/stages/:id', auth, rbac(1), stageController.remove);

module.exports = router;
