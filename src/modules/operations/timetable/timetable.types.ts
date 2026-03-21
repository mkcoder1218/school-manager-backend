export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface CreateTimetableDTO {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
}

export interface UpdateTimetableDTO {
  class_id?: string;
  section_id?: string;
  subject_id?: string;
  teacher_id?: string;
  day?: DayOfWeek;
  start_time?: string;
  end_time?: string;
}

export interface TimetableResponse {
  id: string;
  school_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
  createdAt?: Date;
  updatedAt?: Date;
}
