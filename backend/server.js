'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { sequelize } = require('./src/models');
const config = require('./src/config/env');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middlewares/errorHandler.middleware');

// Route imports
const authRoutes = require('./src/modules/auth/auth.routes');
const userRoutes = require('./src/modules/users/user.routes');
const clientRoutes = require('./src/modules/clients/client.routes');
const vehicleRoutes = require('./src/modules/vehicles/vehicle.routes');
const productRoutes = require('./src/modules/products/product.routes');
const serviceRoutes = require('./src/modules/services/service.routes');
const serviceOrderRoutes = require('./src/modules/serviceOrders/serviceOrder.routes');
const stageRoutes = require('./src/modules/stages/stage.routes');
const taskRoutes = require('./src/modules/tasks/task.routes');
const dashboardRoutes = require('./src/modules/dashboard/dashboard.routes');

const app = express();

// ── Rate limiters ─────────────────────────────────────────────────────────────

/** Strict limiter for auth endpoints (prevents brute-force) */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

/** General API limiter */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static('src/uploads'));

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-orders', serviceOrderRoutes);
app.use('/api', stageRoutes);
app.use('/api', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.PORT;

sequelize.authenticate()
  .then(() => {
    logger.info('Database connection established');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err);
    process.exit(1);
  });

module.exports = app;
