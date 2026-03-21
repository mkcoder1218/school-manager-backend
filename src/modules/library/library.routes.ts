import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  borrowBook,
  createBook,
  deleteBorrow,
  deleteBook,
  listBooks,
  listBorrowHistory,
  returnBook,
  updateBook,
} from './library.controller';

export const libraryRouter = Router();

/**
 * @openapi
 * /api/library/books:
 *   get:
 *     tags:
 *       - Library
 *     summary: List books
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Book list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
libraryRouter.get(
  '/library/books',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'librarian'),
  listBooks
);
/**
 * @openapi
 * /api/library/books:
 *   post:
 *     tags:
 *       - Library
 *     summary: Create book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, title, author, isbn, total_copies, available_copies, category, status]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               total_copies:
 *                 type: integer
 *               available_copies:
 *                 type: integer
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, borrowed, reserved]
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
libraryRouter.post(
  '/library/books',
  authenticateJWT,
  authorizeRoles('super_admin', 'librarian'),
  createBook
);
/**
 * @openapi
 * /api/library/books/{book_id}:
 *   put:
 *     tags:
 *       - Library
 *     summary: Update book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: book_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               total_copies:
 *                 type: integer
 *               available_copies:
 *                 type: integer
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, borrowed, reserved]
 *     responses:
 *       200:
 *         description: Book updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
libraryRouter.put(
  '/library/books/:book_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'librarian'),
  updateBook
);
/**
 * @openapi
 * /api/library/books/{book_id}:
 *   delete:
 *     tags:
 *       - Library
 *     summary: Delete book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: book_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Book deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
libraryRouter.delete(
  '/library/books/:book_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'librarian'),
  deleteBook
);

/**
 * @openapi
 * /api/library/borrows:
 *   get:
 *     tags:
 *       - Library
 *     summary: List borrow records
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
libraryRouter.get(
  '/library/borrows',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'librarian'),
  listBorrowHistory
);
/**
 * @openapi
 * /api/library/borrows:
 *   post:
 *     tags:
 *       - Library
 *     summary: Borrow book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [book_id, student_id, borrow_date, status]
 *             properties:
 *               book_id:
 *                 type: string
 *                 format: uuid
 *               student_id:
 *                 type: string
 *                 format: uuid
 *               borrow_date:
 *                 type: string
 *                 format: date
 *               return_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [borrowed, returned, overdue]
 *     responses:
 *       201:
 *         description: Book borrowed
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
libraryRouter.post(
  '/library/borrows',
  authenticateJWT,
  authorizeRoles('super_admin', 'librarian'),
  borrowBook
);
/**
 * @openapi
 * /api/library/borrows/{borrow_id}:
 *   put:
 *     tags:
 *       - Library
 *     summary: Return book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: borrow_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               return_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [borrowed, returned, overdue]
 *     responses:
 *       200:
 *         description: Borrow record updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Borrow record not found
 */
libraryRouter.put(
  '/library/borrows/:borrow_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'librarian'),
  returnBook
);
/**
 * @openapi
 * /api/library/borrows/{borrow_id}:
 *   delete:
 *     tags:
 *       - Library
 *     summary: Delete borrow record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: borrow_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Borrow record deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Borrow record not found
 */
libraryRouter.delete(
  '/library/borrows/:borrow_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'librarian'),
  deleteBorrow
);
