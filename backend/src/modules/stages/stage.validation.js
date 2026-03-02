'use strict';

const { z } = require('zod');

const stageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  execution_order: z.number().int('execution_order is required'),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
});

const updateStageSchema = stageSchema.partial();

module.exports = { stageSchema, updateStageSchema };
