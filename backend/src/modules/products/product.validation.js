'use strict';

const { z } = require('zod');

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative().optional(),
  status: z.coerce.number().int().min(0).max(1).optional().default(1),
});

const updateProductSchema = productSchema.partial();

module.exports = { productSchema, updateProductSchema };
