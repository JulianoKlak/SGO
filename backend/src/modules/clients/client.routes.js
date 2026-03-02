'use strict';

const { Router } = require('express');
const clientController = require('./client.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');

const router = Router();

router.get('/', auth, clientController.getAll);
router.get('/:id', auth, clientController.getById);
router.post('/', auth, clientController.create);
router.put('/:id', auth, clientController.update);
router.delete('/:id', auth, rbac(1), clientController.remove);

module.exports = router;
