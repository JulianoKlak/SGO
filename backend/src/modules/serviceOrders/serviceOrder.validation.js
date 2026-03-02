'use strict';

const { z } = require('zod');

const createOrderSchema = z.object({
  client_id: z.number().int(),
  vehicle_id: z.number().int().optional(),
  user_id: z.number().int().optional(),
  status: z.enum(['pending', 'open', 'in_progress', 'completed', 'paid', 'cancelled']).optional(),
  client_contact: z.string().optional(),
  client_email: z.string().email().optional().or(z.literal('')),
  client_address: z.string().optional(),
});

const updateOrderSchema = createOrderSchema.partial();

const addProductSchema = z.object({
  product_id: z.number().int(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative().optional(),
});

const addServiceSchema = z.object({
  service_id: z.number().int(),
  price: z.number().nonnegative().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'open', 'in_progress', 'completed', 'paid', 'cancelled']),
});

module.exports = { createOrderSchema, updateOrderSchema, addProductSchema, addServiceSchema, updateStatusSchema };
