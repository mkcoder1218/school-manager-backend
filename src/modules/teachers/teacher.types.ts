import { DocumentType } from '../document/document.model';

export interface TeacherDocumentInput {
  type: DocumentType;
  fileUrl: string;
  fileName?: string | null;
}

export interface CreateTeacherDTO {
  school_id: string;
  branch_id: string | null;
  user_id: string | null;
  employee_id: string;
  documents: TeacherDocumentInput[];
}

