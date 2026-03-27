export interface CreateStudentDTO {
  school_id: string;
  branch_id: string;
  student_id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  gender: 'male' | 'female';
  date_of_birth: string; // YYYY-MM-DD
  admission_number?: string | null;
  phone?: string | null;
  email?: string | null;
  address: string;
  grade: string;
  section: string;
  academic_year: string;
  enrollment_date: string; // YYYY-MM-DD
  status: StudentRegistrationStatus;
  nationality?: string | null;
  place_of_birth?: string | null;
  blood_group?: string | null;
  medical_conditions?: string | null;
  allergies?: string | null;
}

export interface StudentResponse {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  branch_id: string;
}

export type StudentRegistrationStatus = 'active' | 'inactive' | 'graduated' | 'transferred';
export type StudentRegistrationGender = 'male' | 'female';
export type StudentParentRelationship = 'father' | 'mother' | 'guardian' | 'other';

export interface RegisterStudentPayload {
  school_id?: string;
  branch_id?: string | null;
  student: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    gender: StudentRegistrationGender;
    dateOfBirth: string; // YYYY-MM-DD
    studentId: string;
    admissionNumber?: string | null;
    phone?: string | null;
    email?: string | null;
    address: string;
    grade: string;
    section: string;
    academicYear: string;
    enrollmentDate: string; // YYYY-MM-DD
    status: StudentRegistrationStatus;
    nationality?: string | null;
    placeOfBirth?: string | null;
    bloodGroup?: string | null;
    medicalConditions?: string | null;
    allergies?: string | null;
  };
  account?: {
    email?: string | null;
    password: string;
  } | null;
  parents: Array<{
    firstName: string;
    lastName: string;
    phone: string;
    alternativePhone?: string | null;
    email?: string | null;
    address: string;
    occupation?: string | null;
    employer?: string | null;
    relationship: StudentParentRelationship;
    isPrimaryContact: boolean;
    isEmergencyContact: boolean;
  }>;
}

export interface RegisterStudentResult {
  studentId: string;
  id: string;
  userId?: string;
}
