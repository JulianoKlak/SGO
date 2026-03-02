'use strict';

const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  type: z.number().int().min(0).max(2).optional().default(0),
  status: z.number().int().min(0).max(1).optional().default(1),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  type: z.number().int().min(0).max(2).optional(),
  status: z.number().int().min(0).max(1).optional(),
  password: z.string().min(6).optional(),
});

module.exports = { createUserSchema, updateUserSchema };
