export type ExamType = 'online' | 'offline';

export interface CreateExamDTO {
  school_id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  exam_date: Date;
  start_time: string;
  end_time: string;
  type: ExamType;
}

export interface UpdateExamDTO {
  class_id?: string;
  section_id?: string;
  name?: string;
  start_date?: Date;
  end_date?: Date;
  exam_date?: Date;
  start_time?: string;
  end_time?: string;
  type?: ExamType;
}

export interface ExamResponse {
  id: string;
  school_id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  exam_date: Date;
  start_time: string;
  end_time: string;
  type: ExamType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubmitExamAnswerDTO {
  question_id: string;
  answer: string | string[] | boolean | null;
}

export interface CreateExamSubjectDTO {
  exam_id: string;
  subject_id: string;
  total_marks: number;
  passing_marks: number;
}

export interface ExamSubjectResponse {
  id: string;
  exam_id: string;
  subject_id: string;
  total_marks: number;
  passing_marks: number;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface CreateQuestionDTO {
  exam_subject_id: string;
  question_text: string;
  type: QuestionType;
  options?: string[] | null;
  correct_answer?: string | string[] | boolean | null;
  marks: number;
}

export interface QuestionResponse {
  id: string;
  exam_subject_id: string;
  question_text: string;
  type: QuestionType;
  options: string[] | null;
  correct_answer: string | string[] | boolean | null;
  marks: number;
}

export interface CreateStudentAnswerDTO {
  student_id: string;
  question_id: string;
  answer: string | string[] | boolean | null;
}

export interface StudentAnswerResponse {
  id: string;
  student_id: string;
  question_id: string;
  answer: string | string[] | boolean | null;
  marks_obtained: number | null;
}
