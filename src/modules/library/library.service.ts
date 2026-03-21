import { LibraryBook } from '../operations/library-book.model';
import { BookBorrow } from '../operations/book-borrow.model';
import { School } from '../platform/school.model';
import { Student } from '../students/student.model';
import { generateUuid } from '../../core/utils/uuid';
import { FindOptions, WhereOptions } from 'sequelize';
import {
  BookResponse,
  BorrowBookDTO,
  BorrowResponse,
  CreateBookDTO,
  ReturnBookDTO,
  UpdateBookDTO,
} from './library.types';

export class SchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export class BookNotFoundError extends Error {
  constructor() {
    super('Book not found');
  }
}

export class BorrowNotFoundError extends Error {
  constructor() {
    super('Borrow record not found');
  }
}

export class BorrowerNotFoundError extends Error {
  constructor() {
    super('Student not found');
  }
}

export class NoCopiesAvailableError extends Error {
  constructor() {
    super('No copies available');
  }
}

export const libraryService = {
  async listBooks(
    schoolId: string,
    options?: { where?: WhereOptions; order?: FindOptions['order']; limit?: number; offset?: number }
  ): Promise<{ rows: BookResponse[]; count: number }> {
    const result = await LibraryBook.findAndCountAll({
      where: { school_id: schoolId, ...(options?.where ?? {}) },
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((book) => book.get({ plain: true }) as BookResponse),
      count: result.count,
    };
  },

  async getBookById(id: string): Promise<BookResponse | null> {
    const book = await LibraryBook.findByPk(id);
    return book ? (book.get({ plain: true }) as BookResponse) : null;
  },

  async createBook(input: CreateBookDTO): Promise<BookResponse> {
    const school = await School.findByPk(input.school_id);
    if (!school) {
      throw new SchoolNotFoundError();
    }

    const book = await LibraryBook.create({
      id: generateUuid(),
      school_id: input.school_id,
      title: input.title,
      author: input.author,
      isbn: input.isbn,
      total_copies: input.total_copies,
      available_copies: input.available_copies,
      category: input.category,
      status: input.status,
    });

    return book.get({ plain: true }) as BookResponse;
  },

  async updateBook(id: string, input: UpdateBookDTO): Promise<BookResponse> {
    const book = await LibraryBook.findByPk(id);
    if (!book) {
      throw new BookNotFoundError();
    }

    const updated = await book.update({
      title: input.title ?? book.title,
      author: input.author ?? book.author,
      isbn: input.isbn ?? book.isbn,
      total_copies: input.total_copies ?? book.total_copies,
      available_copies: input.available_copies ?? book.available_copies,
      category: input.category ?? book.category,
      status: input.status ?? book.status,
    });

    return updated.get({ plain: true }) as BookResponse;
  },

  async deleteBook(id: string): Promise<void> {
    const book = await LibraryBook.findByPk(id);
    if (!book) {
      throw new BookNotFoundError();
    }
    await book.destroy();
  },

  async borrowBook(input: BorrowBookDTO): Promise<BorrowResponse> {
    const book = await LibraryBook.findByPk(input.book_id);
    if (!book) {
      throw new BookNotFoundError();
    }
    if (book.available_copies <= 0) {
      throw new NoCopiesAvailableError();
    }

    const student = await Student.findByPk(input.student_id);
    if (!student) {
      throw new BorrowerNotFoundError();
    }
    if (student.school_id !== book.school_id) {
      throw new SchoolNotFoundError();
    }

    const borrow = await BookBorrow.create({
      id: generateUuid(),
      school_id: book.school_id,
      book_id: input.book_id,
      student_id: input.student_id,
      borrow_date: input.borrow_date,
      return_date: null,
      status: 'borrowed',
    });

    const newAvailable = book.available_copies - 1;
    await book.update({
      available_copies: newAvailable,
      status: newAvailable > 0 ? 'available' : 'borrowed',
    });

    return borrow.get({ plain: true }) as BorrowResponse;
  },

  async returnBook(id: string, input: ReturnBookDTO): Promise<BorrowResponse> {
    const borrow = await BookBorrow.findByPk(id);
    if (!borrow) {
      throw new BorrowNotFoundError();
    }

    const book = await LibraryBook.findByPk(borrow.book_id);
    if (!book) {
      throw new BookNotFoundError();
    }

    const updated = await borrow.update({
      return_date: input.return_date,
      status: 'returned',
    });

    const newAvailable = book.available_copies + 1;
    await book.update({
      available_copies: newAvailable,
      status: 'available',
    });

    return updated.get({ plain: true }) as BorrowResponse;
  },

  async listBorrowHistory(studentId: string) {
    const borrows = await BookBorrow.findAll({
      where: { student_id: studentId },
    });
    return borrows.map((b) => b.get({ plain: true }) as BorrowResponse);
  },

  async getBorrowById(id: string): Promise<BookBorrow | null> {
    return BookBorrow.findByPk(id);
  },

  async listBorrows(
    schoolId: string,
    studentId?: string,
    options?: { where?: WhereOptions; order?: FindOptions['order']; limit?: number; offset?: number }
  ): Promise<{ rows: BorrowResponse[]; count: number }> {
    const where: Record<string, unknown> = { school_id: schoolId };
    if (studentId) {
      where.student_id = studentId;
    }
    const result = await BookBorrow.findAndCountAll({
      where: { ...where, ...(options?.where ?? {}) },
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((b) => b.get({ plain: true }) as BorrowResponse),
      count: result.count,
    };
  },

  async deleteBorrow(id: string): Promise<void> {
    const borrow = await BookBorrow.findByPk(id);
    if (!borrow) {
      throw new BorrowNotFoundError();
    }
    await borrow.destroy();
  },
};
