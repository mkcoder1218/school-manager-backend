export type StudentFeeStatus = 'pending' | 'paid' | 'overdue';

export interface CreateFeeDTO {
  school_id: string;
  name: string;
  amount: number;
  description?: string | null;
}

export interface UpdateFeeDTO {
  name?: string;
  amount?: number;
  description?: string | null;
}

export interface AssignStudentFeeDTO {
  student_id: string;
  fee_id: string;
  due_date: Date;
}

export interface UpdateStudentFeeDTO {
  status: StudentFeeStatus;
}

export interface FeeResponse {
  id: string;
  school_id: string;
  name: string;
  amount: number;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudentFeeResponse {
  id: string;
  student_id: string;
  fee_id: string;
  amount: number;
  due_date: Date;
  status: StudentFeeStatus;
}
