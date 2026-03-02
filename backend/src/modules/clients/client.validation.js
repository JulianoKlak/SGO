'use strict';

const { z } = require('zod');

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  homephone: z.string().optional(),
  fleet_number: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  customer_report: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
});

const updateClientSchema = clientSchema.partial();

module.exports = { clientSchema, updateClientSchema };
