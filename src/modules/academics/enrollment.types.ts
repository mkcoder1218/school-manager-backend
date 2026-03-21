export interface CreateEnrollmentDTO {
  student_id: string;
  class_id: string;
  section_id: string;
  academic_year_id: string;
}

export interface EnrollmentResponse {
  id: string;
  school_id: string;
  student_id: string;
  class_id: string;
  section_id: string;
  academic_year_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
