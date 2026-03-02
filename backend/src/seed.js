'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    const existing = await User.findOne({ where: { username: 'admin' } });
    if (existing) {
      console.log('Admin user already exists – skipping seed.');
      process.exit(0);
    }

    const password = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      username: 'admin',
      password,
      type: 1,
      status: 1,
      date_added: new Date(),
    });

    console.log('Admin user created: username=admin / password=admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
