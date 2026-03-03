'use strict';

const { z } = require('zod');

const PLATE_REGEX = /^(?:[A-Z]{3}-\d{4}|[A-Z]{3}-\d[A-Z]\d{2})$/;

const vehicleSchema = z.object({
  plate: z
    .string()
    .trim()
    .toUpperCase()
    .regex(PLATE_REGEX, 'Plate must match AAA-1234 or AAA-1A23'),
  model: z.string().optional(),
  brand: z.string().optional(),
  year: z.coerce.number().int().optional(),
  client_id: z.coerce.number().int('client_id is required'),
});

const updateVehicleSchema = vehicleSchema.partial().extend({
  client_id: z.coerce.number().int().optional(),
});

module.exports = { vehicleSchema, updateVehicleSchema };
