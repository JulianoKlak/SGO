'use strict';

const { z } = require('zod');

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().nonnegative().optional(),
  status: z.number().int().min(0).max(1).optional().default(1),
});

const updateServiceSchema = serviceSchema.partial();

module.exports = { serviceSchema, updateServiceSchema };
