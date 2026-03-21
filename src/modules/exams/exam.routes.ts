import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createExam,
  createExamSubject,
  createQuestion,
  createStudentAnswer,
  deleteExam,
  getExam,
  getStudentResults,
  listExams,
  listExamsByClass,
  listExamsBySection,
  submitExam,
  updateExam,
} from './exam.controller';

export const examRouter = Router();

/**
 * @openapi
 * /api/exams:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create exam
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, academic_year_id, class_id, section_id, name, start_date, end_date, type]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               academic_year_id:
 *                 type: string
 *                 format: uuid
 *               class_id:
 *                 type: string
 *                 format: uuid
 *               section_id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *                 enum: [online, offline]
 *     responses:
 *       201:
 *         description: Exam created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
examRouter.post(
  '/exams',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  createExam
);
/**
 * @openapi
 * /api/exams:
 *   get:
 *     tags:
 *       - Exams
 *     summary: List exams
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exam list
 */
examRouter.get(
  '/exams',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  listExams
);
/**
 * @openapi
 * /api/exams/{id}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get exam
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Exam details
 *       404:
 *         description: Exam not found
 */
examRouter.get(
  '/exams/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  getExam
);
/**
 * @openapi
 * /api/exams/{id}:
 *   patch:
 *     tags:
 *       - Exams
 *     summary: Update exam
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *                 enum: [online, offline]
 *     responses:
 *       200:
 *         description: Exam updated
 *       404:
 *         description: Exam not found
 */
examRouter.patch(
  '/exams/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  updateExam
);
/**
 * @openapi
 * /api/exams/{id}:
 *   delete:
 *     tags:
 *       - Exams
 *     summary: Delete exam
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Exam deleted
 *       404:
 *         description: Exam not found
 */
examRouter.delete(
  '/exams/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  deleteExam
);

/**
 * @openapi
 * /api/exams/class/{class_id}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: List exams by class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: class_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Exam list
 */
examRouter.get(
  '/exams/class/:class_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  listExamsByClass
);
/**
 * @openapi
 * /api/exams/section/{section_id}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: List exams by section
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: section_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Exam list
 */
examRouter.get(
  '/exams/section/:section_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  listExamsBySection
);

/**
 * @openapi
 * /api/exams/{exam_id}/submit:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Submit exam answers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exam_id
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
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [question_id, answer]
 *                   properties:
 *                     question_id:
 *                       type: string
 *                       format: uuid
 *                     answer:
 *                       type: string
 *     responses:
 *       200:
 *         description: Exam submitted
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
examRouter.post(
  '/exams/:exam_id/submit',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  submitExam
);

/**
 * @openapi
 * /api/exams/{exam_id}/results:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get exam results
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exam_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Exam results
 *       404:
 *         description: Exam not found
 */
examRouter.get(
  '/exams/:exam_id/results',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  getStudentResults
);

/**
 * @openapi
 * /api/exam-subjects:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create exam subject
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exam_id, subject_id, total_marks, passing_marks]
 *             properties:
 *               exam_id:
 *                 type: string
 *                 format: uuid
 *               subject_id:
 *                 type: string
 *                 format: uuid
 *               total_marks:
 *                 type: number
 *               passing_marks:
 *                 type: number
 *     responses:
 *       201:
 *         description: Exam subject created
 *       400:
 *         description: Validation error
 */
examRouter.post(
  '/exam-subjects',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  createExamSubject
);
/**
 * @openapi
 * /api/questions:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exam_subject_id, question_text, type, marks]
 *             properties:
 *               exam_subject_id:
 *                 type: string
 *                 format: uuid
 *               question_text:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [multiple_choice, true_false, short_answer, essay]
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correct_answer:
 *                 type: string
 *               marks:
 *                 type: number
 *     responses:
 *       201:
 *         description: Question created
 *       400:
 *         description: Validation error
 */
examRouter.post(
  '/questions',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  createQuestion
);
/**
 * @openapi
 * /api/student-answers:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create student answer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [student_id, question_id, answer]
 *             properties:
 *               student_id:
 *                 type: string
 *                 format: uuid
 *               question_id:
 *                 type: string
 *                 format: uuid
 *               answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student answer created
 *       400:
 *         description: Validation error
 */
examRouter.post(
  '/student-answers',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  createStudentAnswer
);
/**
 * @openapi
 * /api/student-results/{exam_id}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get student results by exam
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exam_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Student results
 */
examRouter.get(
  '/student-results/:exam_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  getStudentResults
);
