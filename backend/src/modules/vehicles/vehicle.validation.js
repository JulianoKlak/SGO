'use strict';

const { z } = require('zod');

const vehicleSchema = z.object({
  plate: z.string().min(1, 'Plate is required'),
  model: z.string().optional(),
  brand: z.string().optional(),
  year: z.number().int().optional(),
  client_id: z.number().int('client_id is required'),
});

const updateVehicleSchema = vehicleSchema.partial().extend({
  client_id: z.number().int().optional(),
});

module.exports = { vehicleSchema, updateVehicleSchema };
