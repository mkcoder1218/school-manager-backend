import { Op, fn, col } from 'sequelize';
import { Student } from '../students/student.model';
import { Teacher } from '../teachers/teacher.model';
import { StudentAttendance } from '../attendance/student-attendance.model';
import { Payment } from '../finance/payment.model';
import { StudentFee } from '../finance/student-fee.model';
import { Branch } from '../organization/branch.model';
import { School } from '../platform/school.model';
import { LibraryBook } from '../operations/library-book.model';
import { BookBorrow } from '../operations/book-borrow.model';
import { Enrollment } from '../academics/enrollment.model';
import { Class } from '../academics/class.model';
import { Parent } from '../students/parent.model';
import { StudentParent } from '../students/student-parent.model';
import { User } from '../users/user.model';
import { DashboardAnalytics } from './analytics.types';

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return 0;
};

const attendanceRateForStudents = async (studentIds: string[], schoolId?: string | null): Promise<number> => {
  if (!studentIds.length) return 0;
  const where: Record<string, unknown> = { student_id: { [Op.in]: studentIds } };
  if (schoolId) where.school_id = schoolId;
  const total = await StudentAttendance.count({ where });
  if (!total) return 0;
  const present = await StudentAttendance.count({ where: { ...where, status: 'present' } });
  return Math.round((present / total) * 1000) / 10;
};

export const analyticsService = {
  async getDashboardAnalytics(userId: string, role: string | undefined, schoolId: string | null): Promise<DashboardAnalytics> {
    const user = await User.findByPk(userId);
    const branchId = user?.branch_id ?? null;

    const scopeSchool = role === 'super_admin' ? null : schoolId;
    const branchScope = role === 'school_admin' || role === 'school_principal' || role === 'principal' ? branchId : null;

    const schoolWhere = scopeSchool ? { school_id: scopeSchool } : {};
    const branchWhere = branchScope ? { branch_id: branchScope } : {};

    const students = await Student.count({ where: { ...schoolWhere, ...branchWhere } });
    const teachers = await Teacher.count({ where: { ...schoolWhere, ...branchWhere } });
    const branches = scopeSchool
      ? await Branch.count({ where: { school_id: scopeSchool } })
      : await Branch.count();
    const totalSchools = await School.count();

    const studentIds = await Student.findAll({
      attributes: ['id'],
      where: { ...schoolWhere, ...branchWhere },
    }).then((rows) => rows.map((row) => row.id));
    const attendanceRate = await attendanceRateForStudents(studentIds, scopeSchool ?? undefined);

    const paymentWhere = scopeSchool ? { school_id: scopeSchool } : {};
    const revenueRaw = await Payment.findAll({
      attributes: [[fn('sum', col('amount_paid')), 'total']],
      where: { ...paymentWhere, status: 'success' },
      raw: true,
    });
    const revenueRow = (revenueRaw?.[0] ?? {}) as { total?: string | number };
    const revenue = toNumber(revenueRow.total ?? 0);

    const income = revenue;
    const expense = 0;
    const net = income - expense;

    const totalFeesRaw = await StudentFee.findAll({
      attributes: [[fn('sum', col('amount')), 'total']],
      where: { ...paymentWhere },
      raw: true,
    });
    const totalFeesRow = (totalFeesRaw?.[0] ?? {}) as { total?: string | number };
    const totalFees = toNumber(totalFeesRow.total ?? 0);
    const collectionRate = totalFees ? Math.round((income / totalFees) * 1000) / 10 : 0;

    const transactions = await Payment.findAll({
      where: paymentWhere,
      order: [['payment_date', 'desc']],
      limit: 6,
    });

    const transactionRows = transactions.map((t) => ({
      id: t.id,
      type: 'income' as const,
      amount: toNumber(t.amount_paid),
      category: t.payment_method,
      date: t.payment_date.toISOString().slice(0, 10),
      description: t.status,
    }));

    const branchPerformance = await Branch.findAll({
      attributes: ['id', 'name'],
      where: scopeSchool ? { school_id: scopeSchool } : {},
    }).then(async (branchRows) => {
      const results = await Promise.all(
        branchRows.map(async (b) => {
          const count = await Student.count({ where: { branch_id: b.id } });
          return { label: b.name, value: count };
        })
      );
      return results;
    });

    const newAdmissions = await Student.count({
      where: {
        ...schoolWhere,
        createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });

    const activeClasses = await Class.count({ where: { ...schoolWhere } });
    const studentLoad = await Enrollment.count({ where: { ...schoolWhere } });

    const catalogSize = await LibraryBook.count({ where: { ...schoolWhere } });
    const circulation = await BookBorrow.count({ where: { ...schoolWhere, status: 'borrowed' } });
    const overdue = await BookBorrow.count({ where: { ...schoolWhere, status: 'overdue' } });
    const inventory = await LibraryBook.findAll({ where: { ...schoolWhere }, limit: 10 });

    let parentStudentName: string | null = null;
    let parentAttendance = 0;
    let parentFeesStatus = 'unknown';
    if (role === 'parent' && user?.email && scopeSchool) {
      const parent = await Parent.findOne({ where: { email: user.email, school_id: scopeSchool } });
      if (parent) {
        const studentLinks = await StudentParent.findAll({ where: { parent_id: parent.id } });
        const linkedStudentIds = studentLinks.map((s) => s.student_id);
        const firstStudent = await Student.findOne({ where: { id: linkedStudentIds[0] } });
        parentStudentName = firstStudent ? `${firstStudent.first_name} ${firstStudent.last_name}` : null;
        parentAttendance = await attendanceRateForStudents(linkedStudentIds, scopeSchool);
        const fee = await StudentFee.findOne({
          where: { student_id: { [Op.in]: linkedStudentIds }, status: { [Op.ne]: 'paid' } },
        });
        parentFeesStatus = fee ? 'pending' : 'paid';
      }
    }

    let studentAttendance = 0;
    if (role === 'student' && user?.phone && scopeSchool) {
      const student = await Student.findOne({ where: { phone: user.phone, school_id: scopeSchool } });
      if (student) {
        studentAttendance = await attendanceRateForStudents([student.id], scopeSchool);
      }
    }

    return {
      scope: {
        role,
        school_id: scopeSchool,
        branch_id: branchScope,
      },
      cards: {
        total_schools: totalSchools,
        branches,
        students,
        teachers,
        attendance_rate: attendanceRate,
        revenue,
      },
      branch_performance: branchPerformance,
      finance: {
        income,
        expense,
        net,
        collection_rate: collectionRate,
        transactions: transactionRows,
      },
      registrar: {
        total_students: students,
        new_admissions: newAdmissions,
        transfers: 0,
        attendance_rate: attendanceRate,
      },
      teacher: {
        active_classes: activeClasses,
        student_load: studentLoad,
        grading_tasks: 0,
      },
      librarian: {
        catalog_size: catalogSize,
        circulation,
        overdue,
        inventory: inventory.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          status: b.status,
        })),
      },
      parent: {
        student_name: parentStudentName,
        attendance_rate: parentAttendance,
        fees_status: parentFeesStatus,
        progress: [],
      },
      student: {
        gpa: null,
        attendance_rate: studentAttendance,
        assignments: 0,
        grades: [],
        deadlines: [],
      },
    };
  },
};
