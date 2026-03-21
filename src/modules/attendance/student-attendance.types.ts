export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface CreateStudentAttendanceDTO {
  student_id: string;
  class_id: string;
  section_id: string;
  date: Date;
  status: AttendanceStatus;
}

export interface UpdateStudentAttendanceDTO {
  status: AttendanceStatus;
}

export interface StudentAttendanceResponse {
  id: string;
  student_id: string;
  class_id: string;
  section_id: string;
  date: Date;
  status: AttendanceStatus;
}
