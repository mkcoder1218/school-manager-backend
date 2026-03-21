export type BorrowStatus = 'borrowed' | 'returned' | 'overdue';
export type BookStatus = 'available' | 'borrowed' | 'reserved';

export interface CreateBookDTO {
  school_id: string;
  title: string;
  author: string;
  isbn: string;
  total_copies: number;
  available_copies: number;
  category: string;
  status: BookStatus;
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  isbn?: string;
  total_copies?: number;
  available_copies?: number;
  category?: string;
  status?: BookStatus;
}

export interface BookResponse {
  id: string;
  school_id: string;
  title: string;
  author: string;
  isbn: string;
  total_copies: number;
  available_copies: number;
  category: string;
  status: BookStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BorrowBookDTO {
  book_id: string;
  student_id: string;
  borrow_date: Date;
}

export interface ReturnBookDTO {
  return_date: Date;
}

export interface BorrowResponse {
  id: string;
  book_id: string;
  student_id: string;
  borrow_date: Date;
  return_date: Date | null;
  status: BorrowStatus;
}
