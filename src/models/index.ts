import { PlatformUser } from '../modules/platform/platform-user.model';
import { Plan } from '../modules/platform/plan.model';
import { School } from '../modules/platform/school.model';
import { SchoolSubscription } from '../modules/platform/school-subscription.model';
import { SchoolSettings } from '../modules/platform/school-settings.model';
import { Branch } from '../modules/organization/branch.model';
import { Department } from '../modules/organization/department.model';
import { Role } from '../modules/roles/role.model';
import { Permission } from '../modules/permissions/permission.model';
import { RolePermission } from '../modules/rbac/role-permission.model';
import { User } from '../modules/users/user.model';
import { UserRole } from '../modules/rbac/user-role.model';
import { AcademicYear } from '../modules/academics/academic-year.model';
import { Class } from '../modules/academics/class.model';
import { Section } from '../modules/academics/section.model';
import { Subject } from '../modules/academics/subject.model';
import { Enrollment } from '../modules/academics/enrollment.model';
import { Student } from '../modules/students/student.model';
import { Parent } from '../modules/students/parent.model';
import { StudentParent } from '../modules/students/student-parent.model';
import { Teacher } from '../modules/teachers/teacher.model';
import { TeacherSubject } from '../modules/teachers/teacher-subject.model';
import { Document } from '../modules/document/document.model';
import { StudentAttendance } from '../modules/attendance/student-attendance.model';
import { TeacherAttendance } from '../modules/attendance/teacher-attendance.model';
import { Exam } from '../modules/exams/exam.model';
import { ExamSubject } from '../modules/exams/exam-subject.model';
import { Question } from '../modules/exams/question.model';
import { StudentAnswer } from '../modules/exams/student-answer.model';
import { StudentResult } from '../modules/exams/student-result.model';
import { Fee } from '../modules/finance/fee.model';
import { StudentFee } from '../modules/finance/student-fee.model';
import { Payment } from '../modules/finance/payment.model';
import { Announcement } from '../modules/communication/announcement.model';
import { Message } from '../modules/communication/message.model';
import { Timetable } from '../modules/operations/timetable.model';
import { LibraryBook } from '../modules/operations/library-book.model';
import { BookBorrow } from '../modules/operations/book-borrow.model';
import { TransportRoute } from '../modules/operations/transport-route.model';
import { Vehicle } from '../modules/operations/vehicle.model';
import { StudentTransportAssignment } from '../modules/operations/student-transport-assignment.model';

export const models = {
  PlatformUser,
  Plan,
  School,
  SchoolSubscription,
  SchoolSettings,
  Branch,
  Department,
  Role,
  Permission,
  RolePermission,
  User,
  UserRole,
  AcademicYear,
  Class,
  Section,
  Subject,
  Enrollment,
  Student,
  Parent,
  StudentParent,
  Teacher,
  TeacherSubject,
  Document,
  StudentAttendance,
  TeacherAttendance,
  Exam,
  ExamSubject,
  Question,
  StudentAnswer,
  StudentResult,
  Fee,
  StudentFee,
  Payment,
  Announcement,
  Message,
  Timetable,
  LibraryBook,
  BookBorrow,
  TransportRoute,
  Vehicle,
  StudentTransportAssignment,
};

export const initModels = (): void => {
  School.hasMany(Branch, { foreignKey: 'school_id' ,onDelete:"CASCADE"});
  Branch.belongsTo(School, { foreignKey: 'school_id' });

  School.hasMany(Department, { foreignKey: 'school_id' });
  Department.belongsTo(School, { foreignKey: 'school_id' });
  Branch.hasMany(Department, { foreignKey: 'branch_id' });
  Department.belongsTo(Branch, { foreignKey: 'branch_id' });

  School.hasMany(Role, { foreignKey: 'school_id' });
  Role.belongsTo(School, { foreignKey: 'school_id' });

  Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id' });
  Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id' });
  RolePermission.belongsTo(Role, { foreignKey: 'role_id' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id' });

  School.hasMany(User, { foreignKey: 'school_id' });
  User.belongsTo(School, { foreignKey: 'school_id' });
  Branch.hasMany(User, { foreignKey: 'branch_id' });
  User.belongsTo(Branch, { foreignKey: 'branch_id' });

  User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id' });
  Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });
UserRole.belongsTo(Role, { foreignKey: 'role_id' });

  School.hasMany(AcademicYear, { foreignKey: 'school_id' });
  AcademicYear.belongsTo(School, { foreignKey: 'school_id' });

  School.hasMany(Class, { foreignKey: 'school_id' });
  Class.belongsTo(School, { foreignKey: 'school_id' });
  Class.hasMany(Section, { foreignKey: 'class_id' });
  Section.belongsTo(Class, { foreignKey: 'class_id' });

  School.hasMany(Subject, { foreignKey: 'school_id' });
  Subject.belongsTo(School, { foreignKey: 'school_id' });

  Student.hasMany(StudentParent, { foreignKey: 'student_id', onDelete: 'CASCADE' });
  Parent.hasMany(StudentParent, { foreignKey: 'parent_id', onDelete: 'CASCADE' });
  StudentParent.belongsTo(Student, { foreignKey: 'student_id' });
  StudentParent.belongsTo(Parent, { foreignKey: 'parent_id' });

  Student.belongsToMany(Parent, { through: StudentParent, foreignKey: 'student_id' });
  Parent.belongsToMany(Student, { through: StudentParent, foreignKey: 'parent_id' });

  School.hasMany(Student, { foreignKey: 'school_id' });
  Student.belongsTo(School, { foreignKey: 'school_id' });
  Branch.hasMany(Student, { foreignKey: 'branch_id' });
  Student.belongsTo(Branch, { foreignKey: 'branch_id' });

  School.hasMany(Teacher, { foreignKey: 'school_id' });
  Teacher.belongsTo(School, { foreignKey: 'school_id' });
  Branch.hasMany(Teacher, { foreignKey: 'branch_id' });
  Teacher.belongsTo(Branch, { foreignKey: 'branch_id' });
  User.hasOne(Teacher, { foreignKey: 'user_id' });
  Teacher.belongsTo(User, { foreignKey: 'user_id' });

  Teacher.hasMany(Document, {
    foreignKey: 'ownerId',
    constraints: false,
    scope: { ownerType: 'teacher' },
    as: 'documents',
  });
  Document.belongsTo(Teacher, {
    foreignKey: 'ownerId',
    constraints: false,
    as: 'teacher',
  });

  Student.hasMany(Document, {
    foreignKey: 'ownerId',
    constraints: false,
    scope: { ownerType: 'student' },
    as: 'documents',
  });
  Document.belongsTo(Student, {
    foreignKey: 'ownerId',
    constraints: false,
    as: 'student',
  });

  Teacher.belongsToMany(Subject, { through: TeacherSubject, foreignKey: 'teacher_id' });
  Subject.belongsToMany(Teacher, { through: TeacherSubject, foreignKey: 'subject_id' });

  
  Student.hasMany(Enrollment, { foreignKey: 'student_id' });
  Enrollment.belongsTo(Student, { foreignKey: 'student_id' });
  Class.hasMany(Enrollment, { foreignKey: 'class_id' });
  Enrollment.belongsTo(Class, { foreignKey: 'class_id' });
  Section.hasMany(Enrollment, { foreignKey: 'section_id' });
  Enrollment.belongsTo(Section, { foreignKey: 'section_id' });
  AcademicYear.hasMany(Enrollment, { foreignKey: 'academic_year_id' });
  Enrollment.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });

  Student.hasMany(StudentAttendance, { foreignKey: 'student_id' });
  StudentAttendance.belongsTo(Student, { foreignKey: 'student_id' });
  Class.hasMany(StudentAttendance, { foreignKey: 'class_id' });
  StudentAttendance.belongsTo(Class, { foreignKey: 'class_id' });
  Section.hasMany(StudentAttendance, { foreignKey: 'section_id' });
  StudentAttendance.belongsTo(Section, { foreignKey: 'section_id' });
  Teacher.hasMany(TeacherAttendance, { foreignKey: 'teacher_id' });
  TeacherAttendance.belongsTo(Teacher, { foreignKey: 'teacher_id' });

  School.hasMany(Exam, { foreignKey: 'school_id' });
  Exam.belongsTo(School, { foreignKey: 'school_id' });
  AcademicYear.hasMany(Exam, { foreignKey: 'academic_year_id' });
  Exam.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });
  Class.hasMany(Exam, { foreignKey: 'class_id' });
  Exam.belongsTo(Class, { foreignKey: 'class_id' });
  Section.hasMany(Exam, { foreignKey: 'section_id' });
  Exam.belongsTo(Section, { foreignKey: 'section_id' });

  Exam.hasMany(ExamSubject, { foreignKey: 'exam_id' });
  ExamSubject.belongsTo(Exam, { foreignKey: 'exam_id' });
  Subject.hasMany(ExamSubject, { foreignKey: 'subject_id' });
  ExamSubject.belongsTo(Subject, { foreignKey: 'subject_id' });
  ExamSubject.hasMany(Question, { foreignKey: 'exam_subject_id' });
  Question.belongsTo(ExamSubject, { foreignKey: 'exam_subject_id' });
  Student.hasMany(StudentAnswer, { foreignKey: 'student_id' });
  StudentAnswer.belongsTo(Student, { foreignKey: 'student_id' });
  Question.hasMany(StudentAnswer, { foreignKey: 'question_id' });
  StudentAnswer.belongsTo(Question, { foreignKey: 'question_id' });
  Exam.hasMany(Timetable, { foreignKey: 'exam_id' });
  Timetable.belongsTo(Exam, { foreignKey: 'exam_id' });

  Student.hasMany(StudentResult, { foreignKey: 'student_id' });
  StudentResult.belongsTo(Student, { foreignKey: 'student_id' });
  ExamSubject.hasMany(StudentResult, { foreignKey: 'exam_subject_id' });
  StudentResult.belongsTo(ExamSubject, { foreignKey: 'exam_subject_id' });

  School.hasMany(Fee, { foreignKey: 'school_id' });
  Fee.belongsTo(School, { foreignKey: 'school_id' });
  School.hasMany(StudentFee, { foreignKey: 'school_id' });
  StudentFee.belongsTo(School, { foreignKey: 'school_id' });
  School.hasMany(Payment, { foreignKey: 'school_id' });
  Payment.belongsTo(School, { foreignKey: 'school_id' });
  Student.hasMany(StudentFee, { foreignKey: 'student_id' });
  StudentFee.belongsTo(Student, { foreignKey: 'student_id' });
  Fee.hasMany(StudentFee, { foreignKey: 'fee_id' });
  StudentFee.belongsTo(Fee, { foreignKey: 'fee_id' });
  // AcademicYear relations for fees are not used in the current finance flow.
  StudentFee.hasMany(Payment, { foreignKey: 'student_fee_id' });
  Payment.belongsTo(StudentFee, { foreignKey: 'student_fee_id' });

  School.hasMany(Announcement, { foreignKey: 'school_id' });
  Announcement.belongsTo(School, { foreignKey: 'school_id' });
  User.hasMany(Announcement, { foreignKey: 'created_by' });
  Announcement.belongsTo(User, { foreignKey: 'created_by' });

  User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
  User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
  Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
  Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

  Class.hasMany(Timetable, { foreignKey: 'class_id' });
  Timetable.belongsTo(Class, { foreignKey: 'class_id' });
  Section.hasMany(Timetable, { foreignKey: 'section_id' });
  Timetable.belongsTo(Section, { foreignKey: 'section_id' });
  Subject.hasMany(Timetable, { foreignKey: 'subject_id' });
  Timetable.belongsTo(Subject, { foreignKey: 'subject_id' });
  Teacher.hasMany(Timetable, { foreignKey: 'teacher_id' });
  Timetable.belongsTo(Teacher, { foreignKey: 'teacher_id' });
  School.hasMany(Timetable, { foreignKey: 'school_id' });
  Timetable.belongsTo(School, { foreignKey: 'school_id' });

  School.hasMany(LibraryBook, { foreignKey: 'school_id' });
  LibraryBook.belongsTo(School, { foreignKey: 'school_id' });
  LibraryBook.hasMany(BookBorrow, { foreignKey: 'book_id' });
  BookBorrow.belongsTo(LibraryBook, { foreignKey: 'book_id' });
  School.hasMany(LibraryBook, { foreignKey: 'school_id' });
  LibraryBook.belongsTo(School, { foreignKey: 'school_id' });
  Student.hasMany(BookBorrow, { foreignKey: 'student_id' });
  BookBorrow.belongsTo(Student, { foreignKey: 'student_id' });
  Student.hasMany(BookBorrow, { foreignKey: 'student_id' });
  BookBorrow.belongsTo(Student, { foreignKey: 'student_id' });

  School.hasMany(TransportRoute, { foreignKey: 'school_id' });
  TransportRoute.belongsTo(School, { foreignKey: 'school_id' });
  TransportRoute.hasMany(Vehicle, { foreignKey: 'route_id' });
  Vehicle.belongsTo(TransportRoute, { foreignKey: 'route_id' });
  School.hasMany(StudentTransportAssignment, { foreignKey: 'school_id' });
  StudentTransportAssignment.belongsTo(School, { foreignKey: 'school_id' });
  Student.hasMany(StudentTransportAssignment, { foreignKey: 'student_id' });
  StudentTransportAssignment.belongsTo(Student, { foreignKey: 'student_id' });
  TransportRoute.hasMany(StudentTransportAssignment, { foreignKey: 'route_id' });
  StudentTransportAssignment.belongsTo(TransportRoute, { foreignKey: 'route_id' });
  Vehicle.hasMany(StudentTransportAssignment, { foreignKey: 'vehicle_id' });
  StudentTransportAssignment.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

  School.hasOne(SchoolSettings, { foreignKey: 'school_id' });
  SchoolSettings.belongsTo(School, { foreignKey: 'school_id' });

  School.hasMany(SchoolSubscription, { foreignKey: 'school_id' });
  SchoolSubscription.belongsTo(School, { foreignKey: 'school_id' });
  Plan.hasMany(SchoolSubscription, { foreignKey: 'plan_id' });
  SchoolSubscription.belongsTo(Plan, { foreignKey: 'plan_id' });

  PlatformUser.hasMany(School, { foreignKey: 'owner_user_id' });
  School.belongsTo(PlatformUser, { foreignKey: 'owner_user_id' });
};
