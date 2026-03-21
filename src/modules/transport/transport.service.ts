import { TransportRoute } from '../operations/transport-route.model';
import { Vehicle } from '../operations/vehicle.model';
import { School } from '../platform/school.model';
import { generateUuid } from '../../core/utils/uuid';
import {
  CreateRouteDTO,
  CreateStudentTransportAssignmentDTO,
  CreateVehicleDTO,
  RouteResponse,
  StudentTransportAssignmentResponse,
  UpdateRouteDTO,
  UpdateVehicleDTO,
  VehicleResponse,
} from './transport.types';
import { StudentTransportAssignment } from '../operations/student-transport-assignment.model';
import { Student } from '../students/student.model';

export class SchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export class RouteNotFoundError extends Error {
  constructor() {
    super('Route not found');
  }
}

export class VehicleNotFoundError extends Error {
  constructor() {
    super('Vehicle not found');
  }
}

export class StudentNotFoundError extends Error {
  constructor() {
    super('Student not found');
  }
}

export class AssignmentExistsError extends Error {
  constructor() {
    super('Student is already assigned to this route and vehicle');
  }
}

export const transportService = {
  async listRoutes(schoolId: string): Promise<RouteResponse[]> {
    const routes = await TransportRoute.findAll({ where: { school_id: schoolId } });
    return routes.map((route) => route.get({ plain: true }) as RouteResponse);
  },

  async createRoute(input: CreateRouteDTO): Promise<RouteResponse> {
    const school = await School.findByPk(input.school_id);
    if (!school) {
      throw new SchoolNotFoundError();
    }

    const route = await TransportRoute.create({
      id: generateUuid(),
      school_id: input.school_id,
      name: input.name,
      start_location: input.start_location,
      end_location: input.end_location,
      stops: input.stops,
    });

    return route.get({ plain: true }) as RouteResponse;
  },

  async updateRoute(id: string, input: UpdateRouteDTO): Promise<RouteResponse> {
    const route = await TransportRoute.findByPk(id);
    if (!route) {
      throw new RouteNotFoundError();
    }

    const updated = await route.update({
      name: input.name ?? route.name,
      start_location: input.start_location ?? route.start_location,
      end_location: input.end_location ?? route.end_location,
      stops: input.stops ?? route.stops,
    });

    return updated.get({ plain: true }) as RouteResponse;
  },

  async deleteRoute(id: string): Promise<void> {
    const route = await TransportRoute.findByPk(id);
    if (!route) {
      throw new RouteNotFoundError();
    }
    await route.destroy();
  },

  async listVehicles(schoolId: string): Promise<VehicleResponse[]> {
    const vehicles = await Vehicle.findAll({ where: { school_id: schoolId } });
    return vehicles.map((vehicle) => vehicle.get({ plain: true }) as VehicleResponse);
  },

  async createVehicle(input: CreateVehicleDTO): Promise<VehicleResponse> {
    const route = await TransportRoute.findByPk(input.route_id);
    if (!route) {
      throw new RouteNotFoundError();
    }

    const vehicle = await Vehicle.create({
      id: generateUuid(),
      school_id: route.school_id,
      route_id: input.route_id,
      vehicle_number: input.vehicle_number,
      capacity: input.capacity,
      driver_name: input.driver_name,
      status: input.status,
    });

    return vehicle.get({ plain: true }) as VehicleResponse;
  },

  async updateVehicle(id: string, input: UpdateVehicleDTO): Promise<VehicleResponse> {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new VehicleNotFoundError();
    }

    let routeSchoolId = vehicle.school_id;
    if (input.route_id) {
      const route = await TransportRoute.findByPk(input.route_id);
      if (!route) {
        throw new RouteNotFoundError();
      }
      routeSchoolId = route.school_id;
    }

    const updated = await vehicle.update({
      route_id: input.route_id ?? vehicle.route_id,
      school_id: routeSchoolId,
      vehicle_number: input.vehicle_number ?? vehicle.vehicle_number,
      capacity: input.capacity ?? vehicle.capacity,
      driver_name: input.driver_name ?? vehicle.driver_name,
      status: input.status ?? vehicle.status,
    });

    return updated.get({ plain: true }) as VehicleResponse;
  },

  async deleteVehicle(id: string): Promise<void> {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new VehicleNotFoundError();
    }
    await vehicle.destroy();
  },

  async createAssignment(
    input: CreateStudentTransportAssignmentDTO
  ): Promise<StudentTransportAssignmentResponse> {
    const student = await Student.findByPk(input.student_id);
    if (!student) {
      throw new StudentNotFoundError();
    }
    const route = await TransportRoute.findByPk(input.route_id);
    if (!route) {
      throw new RouteNotFoundError();
    }
    const vehicle = await Vehicle.findByPk(input.vehicle_id);
    if (!vehicle) {
      throw new VehicleNotFoundError();
    }
    if (student.school_id !== route.school_id || vehicle.school_id !== route.school_id) {
      throw new SchoolNotFoundError();
    }
    if (vehicle.route_id !== route.id) {
      throw new RouteNotFoundError();
    }

    const existing = await StudentTransportAssignment.findOne({
      where: {
        student_id: input.student_id,
        route_id: input.route_id,
        vehicle_id: input.vehicle_id,
      },
    });
    if (existing) {
      throw new AssignmentExistsError();
    }

    const assignment = await StudentTransportAssignment.create({
      id: generateUuid(),
      school_id: route.school_id,
      student_id: input.student_id,
      route_id: input.route_id,
      vehicle_id: input.vehicle_id,
    });

    return assignment.get({ plain: true }) as StudentTransportAssignmentResponse;
  },

  async listAssignments(schoolId: string, studentId?: string): Promise<StudentTransportAssignmentResponse[]> {
    const where: Record<string, unknown> = { school_id: schoolId };
    if (studentId) {
      where.student_id = studentId;
    }
    const items = await StudentTransportAssignment.findAll({ where });
    return items.map((item) => item.get({ plain: true }) as StudentTransportAssignmentResponse);
  },
};
