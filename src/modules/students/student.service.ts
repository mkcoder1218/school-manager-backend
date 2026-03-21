import { Student } from './student.model';
import { School } from '../platform/school.model';
import { Branch } from '../organization/branch.model';
import { generateUuid } from '../../core/utils/uuid';
import { CreateStudentDTO, StudentResponse } from './student.types';

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

    const existing = await Student.findOne({
      where: { school_id: input.school_id, admission_number: input.admission_number },
    });
    if (existing) {
      throw new AdmissionNumberExistsError();
    }

    const student = await Student.create({
      id: generateUuid(),
      school_id: input.school_id,
      branch_id: input.branch_id,
      first_name: input.first_name,
      last_name: input.last_name,
      gender: input.gender,
      date_of_birth: input.date_of_birth,
      admission_number: input.admission_number,
      phone: input.phone ?? null,
      address: input.address,
    });

    return {
      id: student.id,
      admission_number: student.admission_number,
      first_name: student.first_name,
      last_name: student.last_name,
      branch_id: student.branch_id,
    };
  },
};
