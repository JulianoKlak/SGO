'use strict';

const { Router } = require('express');
const serviceController = require('./service.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');

const router = Router();

router.get('/', auth, serviceController.getAll);
router.get('/:id', auth, serviceController.getById);
router.post('/', auth, rbac(1), serviceController.create);
router.put('/:id', auth, rbac(1), serviceController.update);
router.delete('/:id', auth, rbac(1), serviceController.remove);

module.exports = router;
