import { Request, Response } from 'express';
import {
  createRouteSchema,
  createAssignmentSchema,
  createVehicleSchema,
  updateRouteSchema,
  updateVehicleSchema,
} from './transport.validation';
import {
  CreateRouteDTO,
  CreateStudentTransportAssignmentDTO,
  CreateVehicleDTO,
  UpdateRouteDTO,
  UpdateVehicleDTO,
} from './transport.types';
import {
  AssignmentExistsError,
  RouteNotFoundError,
  SchoolNotFoundError,
  StudentNotFoundError,
  VehicleNotFoundError,
  transportService,
} from './transport.service';
import { TransportRoute } from '../operations/transport-route.model';

const resolveSchoolId = (req: Request, bodySchoolId?: string): string | null => {
  if (req.user?.role === 'super_admin') {
    return bodySchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const listRoutes = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }
  try {
    const routes = await transportService.listRoutes(schoolId);
    res.status(200).json({ data: routes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createRoute = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createRouteSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  const dto = value as CreateRouteDTO;
  const schoolId = resolveSchoolId(req, dto.school_id);
  if (!schoolId || (req.user?.role !== 'super_admin' && dto.school_id !== schoolId)) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }
  try {
    const route = await transportService.createRoute(dto);
    res.status(201).json({ message: 'Route created successfully', data: route });
  } catch (error) {
    if (error instanceof SchoolNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRoute = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateRouteSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  try {
    const existing = await TransportRoute.findByPk(req.params.route_id);
    if (!existing) {
      res.status(404).json({ message: 'Route not found' });
      return;
    }
    const schoolId = resolveSchoolId(req, existing.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && existing.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    const route = await transportService.updateRoute(req.params.route_id, value as UpdateRouteDTO);
    res.status(200).json({ message: 'Route updated successfully', data: route });
  } catch (error) {
    if (error instanceof RouteNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await TransportRoute.findByPk(req.params.route_id);
    if (!existing) {
      res.status(404).json({ message: 'Route not found' });
      return;
    }
    const schoolId = resolveSchoolId(req, existing.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && existing.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    await transportService.deleteRoute(req.params.route_id);
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    if (error instanceof RouteNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listVehicles = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }
  try {
    const vehicles = await transportService.listVehicles(schoolId);
    res.status(200).json({ data: vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createVehicleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  try {
    const vehicle = await transportService.createVehicle(value as CreateVehicleDTO);
    res.status(201).json({ message: 'Vehicle created successfully', data: vehicle });
  } catch (error) {
    if (error instanceof RouteNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateVehicleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  try {
    const vehicle = await transportService.updateVehicle(req.params.vehicle_id, value as UpdateVehicleDTO);
    res.status(200).json({ message: 'Vehicle updated successfully', data: vehicle });
  } catch (error) {
    if (error instanceof VehicleNotFoundError || error instanceof RouteNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    await transportService.deleteVehicle(req.params.vehicle_id);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    if (error instanceof VehicleNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createAssignmentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  try {
    const dto = value as CreateStudentTransportAssignmentDTO;
    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }
    if (req.user?.role !== 'super_admin') {
      const route = await TransportRoute.findByPk(dto.route_id);
      if (!route || route.school_id !== schoolId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }
    const assignment = await transportService.createAssignment(dto);
    res.status(201).json({ message: 'Assignment created successfully', data: assignment });
  } catch (error) {
    if (
      error instanceof StudentNotFoundError ||
      error instanceof RouteNotFoundError ||
      error instanceof VehicleNotFoundError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof AssignmentExistsError) {
      res.status(409).json({ message: error.message });
      return;
    }
    if (error instanceof SchoolNotFoundError) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listAssignments = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }
  try {
    const items = await transportService.listAssignments(
      schoolId,
      req.query.student_id as string | undefined
    );
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
