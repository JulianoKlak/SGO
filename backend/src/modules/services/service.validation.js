'use strict';

const { z } = require('zod');

const stageTemplateSchema = z.object({
  name: z.string().trim().min(1, 'Stage name is required'),
  description: z.string().trim().optional().default(''),
});

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().nonnegative().optional(),
  status: z.coerce.number().int().min(0).max(1).optional().default(1),
  steps: z.array(stageTemplateSchema).optional().default([]),
});

const updateServiceSchema = serviceSchema.partial();

module.exports = { serviceSchema, updateServiceSchema };
