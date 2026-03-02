'use strict';

const { Router } = require('express');
const dashboardController = require('./dashboard.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');

const router = Router();

router.get('/metrics', auth, rbac(0, 1), dashboardController.getMetrics);
router.get('/mechanics', auth, rbac(0, 1), dashboardController.getMechanics);
router.get('/orders-progress', auth, rbac(0, 1), dashboardController.getOrdersProgress);

module.exports = router;
