export interface CreateSectionDTO {
  class_id: string;
  name: string;
}

export interface UpdateSectionDTO {
  name?: string;
}

export interface SectionResponse {
  id: string;
  school_id: string;
  class_id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
