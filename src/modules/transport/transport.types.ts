export type VehicleStatus = 'active' | 'inactive';

export interface CreateRouteDTO {
  school_id: string;
  name: string;
  start_location: string;
  end_location: string;
  stops: string[];
}

export interface UpdateRouteDTO {
  name?: string;
  start_location?: string;
  end_location?: string;
  stops?: string[];
}

export interface RouteResponse {
  id: string;
  school_id: string;
  name: string;
  start_location: string;
  end_location: string;
  stops: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateVehicleDTO {
  route_id: string;
  vehicle_number: string;
  capacity: number;
  driver_name: string;
  status: VehicleStatus;
}

export interface UpdateVehicleDTO {
  route_id?: string;
  vehicle_number?: string;
  capacity?: number;
  driver_name?: string;
  status?: VehicleStatus;
}

export interface VehicleResponse {
  id: string;
  route_id: string;
  vehicle_number: string;
  capacity: number;
  driver_name: string;
  status: VehicleStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateStudentTransportAssignmentDTO {
  student_id: string;
  route_id: string;
  vehicle_id: string;
}

export interface StudentTransportAssignmentResponse {
  id: string;
  student_id: string;
  route_id: string;
  vehicle_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
