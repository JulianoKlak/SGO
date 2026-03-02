'use strict';

const { Router } = require('express');
const userController = require('./user.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');

const router = Router();

// All user management routes are admin-only
router.get('/mechanics', auth, userController.getMechanics);
router.get('/', auth, rbac(1), userController.getAll);
router.get('/:id', auth, rbac(1), userController.getById);
router.post('/', auth, rbac(1), userController.create);
router.put('/:id', auth, rbac(1), userController.update);
router.delete('/:id', auth, rbac(1), userController.remove);

module.exports = router;
