'use strict';

const { Router } = require('express');
const c = require('./task.controller');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const { mechanicOnly } = require('../../middlewares/mechanicGuard.middleware');
const upload = require('../../utils/upload');

const router = Router();

// Tasks under stages
router.get('/stages/:stageId/tasks', auth, c.getByStage);
router.post('/stages/:stageId/tasks', auth, c.create);

// Individual task operations
router.get('/tasks/:id', auth, c.getById);
router.put('/tasks/:id', auth, c.update);
router.patch('/tasks/:id/status', auth, c.updateStatus);
router.delete('/tasks/:id', auth, rbac(1), c.remove);

// Comments
router.get('/tasks/:id/comments', auth, c.getComments);
router.post('/tasks/:id/comments', auth, c.addComment);

// Images
router.get('/tasks/:id/images', auth, c.getImages);
router.post('/tasks/:id/images', auth, upload.single('image'), c.addImage);

// Mechanic panel
router.get('/mechanic/orders', auth, mechanicOnly, c.getMechanicOrders);
router.patch('/mechanic/orders/:id/start', auth, mechanicOnly, c.startMechanicOrder);
router.patch('/mechanic/orders/:id/block', auth, mechanicOnly, c.blockMechanicOrder);
router.put('/mechanic/tasks/:id/complete', auth, mechanicOnly, c.completeTask);

module.exports = router;
