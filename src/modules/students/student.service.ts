import { Transaction } from 'sequelize';
import bcrypt from 'bcrypt';
import { Student } from './student.model';
import { Parent, ParentAttributes } from './parent.model';
import { StudentParent } from './student-parent.model';
import { School } from '../platform/school.model';
import { Branch } from '../organization/branch.model';
import { Role } from '../roles/role.model';
import { User } from '../users/user.model';
import { UserRole } from '../rbac/user-role.model';
import { generateUuid } from '../../core/utils/uuid';
import { CreateStudentDTO, RegisterStudentPayload, RegisterStudentResult, StudentResponse } from './student.types';
import { sequelize } from '../../core/database/sequelize';

export class SchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export class BranchNotFoundError extends Error {
  constructor() {
    super('Branch not found');
  }
}

export class BranchMismatchError extends Error {
  constructor() {
    super('Branch does not belong to the school');
  }
}

export class AdmissionNumberExistsError extends Error {
  constructor() {
    super('Admission number already exists for this school');
  }
}

export class StudentIdExistsError extends Error {
  constructor() {
    super('Student ID already exists');
  }
}

export class StudentAccountEmailExistsError extends Error {
  constructor() {
    super('Account email already exists');
  }
}

export class StudentRoleNotFoundError extends Error {
  constructor() {
    super('Student role not found');
  }
}

export const studentService = {
  async createStudent(input: CreateStudentDTO): Promise<StudentResponse> {
    const school = await School.findByPk(input.school_id);
    if (!school) {
      throw new SchoolNotFoundError();
    }

    const branch = await Branch.findByPk(input.branch_id);
    if (!branch) {
      throw new BranchNotFoundError();
    }

    if (branch.school_id !== input.school_id) {
      throw new BranchMismatchError();
    }

    if (input.admission_number) {
      const existingAdmission = await Student.findOne({
        where: { school_id: input.school_id, admission_number: input.admission_number },
      });
      if (existingAdmission) {
        throw new AdmissionNumberExistsError();
      }
    }

    const existingStudentId = await Student.findOne({ where: { student_id: input.student_id } });
    if (existingStudentId) {
      throw new StudentIdExistsError();
    }

    const student = await Student.create({
      id: generateUuid(),
      school_id: input.school_id,
      branch_id: input.branch_id,
      student_id: input.student_id,
      first_name: input.first_name,
      middle_name: input.middle_name ?? null,
      last_name: input.last_name,
      gender: input.gender,
      date_of_birth: input.date_of_birth,
      admission_number: input.admission_number ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      address: input.address,
      grade: input.grade,
      section: input.section,
      academic_year: input.academic_year,
      enrollment_date: input.enrollment_date,
      status: input.status,
      nationality: input.nationality ?? null,
      place_of_birth: input.place_of_birth ?? null,
      blood_group: input.blood_group ?? null,
      medical_conditions: input.medical_conditions ?? null,
      allergies: input.allergies ?? null,
    });

    return {
      id: student.id,
      admission_number: student.admission_number ?? '',
      first_name: student.first_name,
      last_name: student.last_name,
      branch_id: student.branch_id,
    };
  },

  async registerStudent(
    payload: RegisterStudentPayload,
    context: { schoolId: string; branchId?: string | null }
  ): Promise<RegisterStudentResult> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const school = await School.findByPk(context.schoolId, { transaction });
      if (!school) {
        throw new SchoolNotFoundError();
      }

      const branchId =
        context.branchId ??
        (await Branch.findOne({ where: { school_id: context.schoolId }, transaction }))?.id ??
        null;

      if (!branchId) {
        throw new BranchNotFoundError();
      }

      const branch = await Branch.findByPk(branchId, { transaction });
      if (!branch) {
        throw new BranchNotFoundError();
      }

      if (branch.school_id !== context.schoolId) {
        throw new BranchMismatchError();
      }

      const existingStudentId = await Student.findOne({
        where: { student_id: payload.student.studentId },
        transaction,
      });
      if (existingStudentId) {
        throw new StudentIdExistsError();
      }

      if (payload.student.admissionNumber) {
        const existingAdmission = await Student.findOne({
          where: { school_id: context.schoolId, admission_number: payload.student.admissionNumber },
          transaction,
        });
        if (existingAdmission) {
          throw new AdmissionNumberExistsError();
        }
      }

      const student = await Student.create(
        {
          id: generateUuid(),
          school_id: context.schoolId,
          branch_id: branchId,
          student_id: payload.student.studentId,
          first_name: payload.student.firstName,
          middle_name: payload.student.middleName ?? null,
          last_name: payload.student.lastName,
          gender: payload.student.gender,
          date_of_birth: payload.student.dateOfBirth,
          admission_number: payload.student.admissionNumber ?? null,
          phone: payload.student.phone ?? null,
          email: payload.student.email ?? null,
          address: payload.student.address,
          grade: payload.student.grade,
          section: payload.student.section,
          academic_year: payload.student.academicYear,
          enrollment_date: payload.student.enrollmentDate,
          status: payload.student.status,
          nationality: payload.student.nationality ?? null,
          place_of_birth: payload.student.placeOfBirth ?? null,
          blood_group: payload.student.bloodGroup ?? null,
          medical_conditions: payload.student.medicalConditions ?? null,
          allergies: payload.student.allergies ?? null,
        },
        { transaction }
      );

      const parents = await Promise.all(
        payload.parents.map(async (p) => {
          const phone = p.phone.trim();
          const [parent, created] = await Parent.findOrCreate({
            where: { school_id: context.schoolId, phone },
            defaults: {
              id: generateUuid(),
              school_id: context.schoolId,
              first_name: p.firstName,
              last_name: p.lastName,
              phone,
              alternative_phone: p.alternativePhone ?? null,
              email: p.email ?? null,
              address: p.address,
              occupation: p.occupation ?? null,
              employer: p.employer ?? null,
            },
            transaction,
          });

          if (!created) {
            const next: Partial<ParentAttributes> = {};
            if (p.firstName && parent.first_name !== p.firstName) next.first_name = p.firstName;
            if (p.lastName && parent.last_name !== p.lastName) next.last_name = p.lastName;
            if (p.alternativePhone !== undefined) next.alternative_phone = p.alternativePhone ?? null;
            if (p.email !== undefined) next.email = p.email ?? null;
            if (p.address && parent.address !== p.address) next.address = p.address;
            if (p.occupation !== undefined) next.occupation = p.occupation ?? null;
            if (p.employer !== undefined) next.employer = p.employer ?? null;
            if (Object.keys(next).length > 0) {
              await parent.update(next, { transaction });
            }
          }

          return parent;
        })
      );

      await StudentParent.bulkCreate(
        parents.map((parent, idx) => ({
          id: generateUuid(),
          school_id: context.schoolId,
          student_id: student.id,
          parent_id: parent.id,
          relationship: payload.parents[idx].relationship,
          is_primary_contact: payload.parents[idx].isPrimaryContact,
          is_emergency_contact: payload.parents[idx].isEmergencyContact,
        })),
        { transaction }
      );

      let userId: string | undefined;
      if (payload.account) {
        const email = (payload.account.email ?? payload.student.email ?? '').trim();
        const existingUser = await User.findOne({ where: { email }, transaction });
        if (existingUser) {
          throw new StudentAccountEmailExistsError();
        }

        const role = await Role.findOne({ where: { name: 'student' }, transaction });
        if (!role) {
          throw new StudentRoleNotFoundError();
        }

        const passwordHash = await bcrypt.hash(payload.account.password, 10);
        const user = await User.create(
          {
            id: generateUuid(),
            school_id: context.schoolId,
            branch_id: branchId,
            email,
            firstName: payload.student.firstName,
            lastName: payload.student.lastName,
            phone: payload.student.phone ?? null,
            password: passwordHash,
            status: 'active',
          },
          { transaction }
        );
        await UserRole.create(
          {
            id: generateUuid(),
            user_id: user.id,
            role_id: role.id,
            school_id: context.schoolId,
          },
          { transaction }
        );
        userId = user.id;
      }

      return { id: student.id, studentId: student.student_id, userId };
    });
  },
};
