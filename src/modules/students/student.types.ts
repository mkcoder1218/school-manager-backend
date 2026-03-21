export interface CreateStudentDTO {
  school_id: string;
  branch_id: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female';
  date_of_birth: Date;
  admission_number: string;
  phone?: string | null;
  address: string;
}

export interface StudentResponse {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  branch_id: string;
}
