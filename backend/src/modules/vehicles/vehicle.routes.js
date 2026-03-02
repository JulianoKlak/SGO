'use strict';

const { Router } = require('express');
const vehicleController = require('./vehicle.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');

const router = Router();

router.get('/', auth, vehicleController.getAll);
router.get('/:id', auth, vehicleController.getById);
router.post('/', auth, vehicleController.create);
router.put('/:id', auth, vehicleController.update);
router.delete('/:id', auth, rbac(1), vehicleController.remove);

module.exports = router;
