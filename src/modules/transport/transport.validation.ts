import Joi from 'joi';

export const createRouteSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
  start_location: Joi.string().trim().required(),
  end_location: Joi.string().trim().required(),
  stops: Joi.array().items(Joi.string().trim()).min(2).required(),
});

export const updateRouteSchema = Joi.object({
  name: Joi.string().trim(),
  start_location: Joi.string().trim(),
  end_location: Joi.string().trim(),
  stops: Joi.array().items(Joi.string().trim()).min(2),
});

export const createVehicleSchema = Joi.object({
  route_id: Joi.string().uuid().required(),
  vehicle_number: Joi.string().trim().required(),
  capacity: Joi.number().integer().min(1).required(),
  driver_name: Joi.string().trim().required(),
  status: Joi.string().valid('active', 'inactive').required(),
});

export const updateVehicleSchema = Joi.object({
  route_id: Joi.string().uuid(),
  vehicle_number: Joi.string().trim(),
  capacity: Joi.number().integer().min(1),
  driver_name: Joi.string().trim(),
  status: Joi.string().valid('active', 'inactive'),
});

export const createAssignmentSchema = Joi.object({
  student_id: Joi.string().uuid().required(),
  route_id: Joi.string().uuid().required(),
  vehicle_id: Joi.string().uuid().required(),
});
