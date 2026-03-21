import { Fee } from '../finance/fee.model';
import { StudentFee } from '../finance/student-fee.model';
import { Student } from '../students/student.model';
import { School } from '../platform/school.model';
import { generateUuid } from '../../core/utils/uuid';
import { FindOptions, WhereOptions } from 'sequelize';
import {
  AssignStudentFeeDTO,
  CreateFeeDTO,
  FeeResponse,
  StudentFeeResponse,
  UpdateFeeDTO,
  UpdateStudentFeeDTO,
} from './fee.types';

export class SchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export class FeeNotFoundError extends Error {
  constructor() {
    super('Fee not found');
  }
}

export class StudentNotFoundError extends Error {
  constructor() {
    super('Student not found');
  }
}

export class StudentFeeNotFoundError extends Error {
  constructor() {
    super('Student fee not found');
  }
}

export class SchoolMismatchError extends Error {
  constructor() {
    super('Entity does not belong to the school');
  }
}

export class StudentFeeExistsError extends Error {
  constructor() {
    super('Student already has this fee assigned');
  }
}

export const feeService = {
  async createFee(input: CreateFeeDTO): Promise<FeeResponse> {
    const school = await School.findByPk(input.school_id);
    if (!school) {
      throw new SchoolNotFoundError();
    }

    const fee = await Fee.create({
      id: generateUuid(),
      school_id: input.school_id,
      name: input.name,
      amount: input.amount,
      description: input.description ?? null,
    });

    return fee.get({ plain: true }) as FeeResponse;
  },

  async listFees(
    schoolId: string,
    options?: { where?: WhereOptions; order?: FindOptions['order']; limit?: number; offset?: number }
  ): Promise<{ rows: FeeResponse[]; count: number }> {
    const result = await Fee.findAndCountAll({
      where: { school_id: schoolId, ...(options?.where ?? {}) },
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((fee) => fee.get({ plain: true }) as FeeResponse),
      count: result.count,
    };
  },

  async getFeeById(id: string): Promise<FeeResponse | null> {
    const fee = await Fee.findByPk(id);
    return fee ? (fee.get({ plain: true }) as FeeResponse) : null;
  },

  async updateFee(id: string, input: UpdateFeeDTO): Promise<FeeResponse> {
    const fee = await Fee.findByPk(id);
    if (!fee) {
      throw new FeeNotFoundError();
    }

    const updated = await fee.update({
      name: input.name ?? fee.name,
      amount: input.amount ?? fee.amount,
      description: input.description ?? fee.description,
    });

    return updated.get({ plain: true }) as FeeResponse;
  },

  async deleteFee(id: string): Promise<void> {
    const fee = await Fee.findByPk(id);
    if (!fee) {
      throw new FeeNotFoundError();
    }
    await fee.destroy();
  },

  async assignFeeToStudent(input: AssignStudentFeeDTO): Promise<StudentFeeResponse> {
    const student = await Student.findByPk(input.student_id);
    if (!student) {
      throw new StudentNotFoundError();
    }

    const fee = await Fee.findByPk(input.fee_id);
    if (!fee) {
      throw new FeeNotFoundError();
    }

    if (student.school_id !== fee.school_id) {
      throw new SchoolMismatchError();
    }

    const existing = await StudentFee.findOne({
      where: { student_id: input.student_id, fee_id: input.fee_id },
    });
    if (existing) {
      throw new StudentFeeExistsError();
    }

    const studentFee = await StudentFee.create({
      id: generateUuid(),
      school_id: fee.school_id,
      student_id: input.student_id,
      fee_id: input.fee_id,
      amount: fee.amount,
      due_date: input.due_date,
      status: 'pending',
    });

    return {
      id: studentFee.id,
      student_id: studentFee.student_id,
      fee_id: studentFee.fee_id,
      amount: Number(studentFee.amount),
      due_date: studentFee.due_date,
      status: studentFee.status,
    };
  },

  async listStudentFees(filters: {
    school_id: string;
    student_id?: string;
    limit?: number;
    offset?: number;
    order?: FindOptions['order'];
  }): Promise<{ rows: StudentFeeResponse[]; count: number }> {
    const where: Record<string, unknown> = { school_id: filters.school_id };
    if (filters.student_id) {
      where.student_id = filters.student_id;
    }

    const result = await StudentFee.findAndCountAll({
      where,
      order: filters.order,
      limit: filters.limit,
      offset: filters.offset,
    });
    const rows = result.rows.map((sf) => ({
      id: sf.id,
      student_id: sf.student_id,
      fee_id: sf.fee_id,
      amount: Number(sf.amount),
      due_date: sf.due_date,
      status: sf.status,
    }));
    return { rows, count: result.count };
  },

  async updateStudentFeeStatus(id: string, input: UpdateStudentFeeDTO): Promise<StudentFeeResponse> {
    const studentFee = await StudentFee.findByPk(id);
    if (!studentFee) {
      throw new StudentFeeNotFoundError();
    }

    const updated = await studentFee.update({ status: input.status });
    return {
      id: updated.id,
      student_id: updated.student_id,
      fee_id: updated.fee_id,
      amount: Number(updated.amount),
      due_date: updated.due_date,
      status: updated.status,
    };
  },

  async getStudentFeeById(id: string): Promise<StudentFee | null> {
    return StudentFee.findByPk(id);
  },

  async feeBelongsToSchool(id: string, schoolId: string): Promise<boolean> {
    const fee = await Fee.findByPk(id);
    return !!fee && fee.school_id === schoolId;
  },

  async studentFeeBelongsToSchool(id: string, schoolId: string): Promise<boolean> {
    const studentFee = await StudentFee.findByPk(id);
    return !!studentFee && studentFee.school_id === schoolId;
  },

  async studentBelongsToSchool(id: string, schoolId: string): Promise<boolean> {
    const student = await Student.findByPk(id);
    return !!student && student.school_id === schoolId;
  },
};
