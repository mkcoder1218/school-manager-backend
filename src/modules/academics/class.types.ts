export interface CreateClassDTO {
  school_id: string;
  name: string;
}

export interface UpdateClassDTO {
  name?: string;
}

export interface ClassResponse {
  id: string;
  school_id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
