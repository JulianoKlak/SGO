'use strict';

const { Router } = require('express');
const authController = require('./auth.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');

const router = Router();

router.post('/login', authController.login);
router.post('/register', auth, rbac(1), authController.register);
router.get('/me', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
