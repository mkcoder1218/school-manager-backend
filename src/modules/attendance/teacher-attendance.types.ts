export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface CreateTeacherAttendanceDTO {
  teacher_id: string;
  date: Date;
  status: AttendanceStatus;
}

export interface UpdateTeacherAttendanceDTO {
  status: AttendanceStatus;
}

export interface TeacherAttendanceResponse {
  id: string;
  teacher_id: string;
  date: Date;
  status: AttendanceStatus;
}
