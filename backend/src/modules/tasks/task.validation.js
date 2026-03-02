'use strict';

const { z } = require('zod');

const taskSchema = z.object({
  description: z.string().optional(),
  user_id: z.number().int().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'blocked']).optional(),
  estimated_time_minutes: z.number().int().nonnegative().optional(),
  actual_time_minutes: z.number().int().nonnegative().optional(),
});

const updateTaskSchema = taskSchema.partial();

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'blocked']),
});

const addCommentSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty'),
});

module.exports = { taskSchema, updateTaskSchema, updateStatusSchema, addCommentSchema };
