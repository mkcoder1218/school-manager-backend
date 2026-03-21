import { Request, Response } from 'express';
import {
  BookNotFoundError,
  BorrowNotFoundError,
  BorrowerNotFoundError,
  NoCopiesAvailableError,
  SchoolNotFoundError,
  libraryService,
} from './library.service';
import {
  borrowBookSchema,
  createBookSchema,
  returnBookSchema,
  updateBookSchema,
} from './library.validation';
import { BorrowBookDTO, CreateBookDTO, ReturnBookDTO, UpdateBookDTO } from './library.types';
import { buildListQuery, buildMeta } from '../../core/utils/query';

const resolveSchoolId = (req: Request, bodySchoolId?: string): string | null => {
  if (req.user?.role === 'super_admin') {
    return bodySchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const listBooks = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }
  try {
    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'title', 'author'] }
    );
    const result = await libraryService.listBooks(schoolId, {
      where,
      order: orderBy,
      limit,
      offset,
    });
    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createBookSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const dto = value as CreateBookDTO;
  if (dto.available_copies > dto.total_copies) {
    res.status(400).json({ message: 'available_copies cannot exceed total_copies' });
    return;
  }
  const schoolId = resolveSchoolId(req, dto.school_id);
  if (!schoolId || (req.user?.role !== 'super_admin' && dto.school_id !== schoolId)) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const book = await libraryService.createBook(dto);
    res.status(201).json({ message: 'Book created successfully', data: book });
  } catch (error) {
    if (error instanceof SchoolNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateBookSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  const dto = value as UpdateBookDTO;
  if (
    dto.total_copies !== undefined &&
    dto.available_copies !== undefined &&
    dto.available_copies > dto.total_copies
  ) {
    res.status(400).json({ message: 'available_copies cannot exceed total_copies' });
    return;
  }
  try {
    const existing = await libraryService.getBookById(req.params.book_id);
    if (!existing) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    const schoolId = resolveSchoolId(req, existing.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && existing.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    const updated = await libraryService.updateBook(req.params.book_id, dto);
    res.status(200).json({ message: 'Book updated successfully', data: updated });
  } catch (error) {
    if (error instanceof BookNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await libraryService.getBookById(req.params.book_id);
    if (!existing) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    const schoolId = resolveSchoolId(req, existing.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && existing.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    await libraryService.deleteBook(req.params.book_id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    if (error instanceof BookNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const borrowBook = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = borrowBookSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  const dto = value as BorrowBookDTO;
  try {
    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }
    if (req.user?.role === 'student' && req.user.user_id !== dto.student_id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    const borrow = await libraryService.borrowBook(dto);
    res.status(201).json({ message: 'Book borrowed successfully', data: borrow });
  } catch (error) {
    if (
      error instanceof BookNotFoundError ||
      error instanceof BorrowerNotFoundError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof NoCopiesAvailableError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const returnBook = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = returnBookSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  try {
    const existing = await libraryService.getBorrowById(req.params.borrow_id);
    if (!existing) {
      res.status(404).json({ message: 'Borrow record not found' });
      return;
    }
    const schoolId = resolveSchoolId(req, existing.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && existing.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    const borrow = await libraryService.returnBook(req.params.borrow_id, value as ReturnBookDTO);
    res.status(200).json({ message: 'Book returned successfully', data: borrow });
  } catch (error) {
    if (error instanceof BorrowNotFoundError || error instanceof BookNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listBorrowHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }
    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'due_date'] }
    );
    const result = await libraryService.listBorrows(schoolId, undefined, {
      where,
      order: orderBy,
      limit,
      offset,
    });
    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBorrow = async (req: Request, res: Response): Promise<void> => {
  try {
    await libraryService.deleteBorrow(req.params.borrow_id);
    res.status(200).json({ message: 'Borrow record deleted successfully' });
  } catch (error) {
    if (error instanceof BorrowNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
