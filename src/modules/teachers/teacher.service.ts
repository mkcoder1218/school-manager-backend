import { Transaction } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';
import { generateUuid } from '../../core/utils/uuid';
import { Branch } from '../organization/branch.model';
import { School } from '../platform/school.model';
import { User } from '../users/user.model';
import { Document } from '../document/document.model';
import { Teacher } from './teacher.model';
import { CreateTeacherDTO } from './teacher.types';

export class TeacherSchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export class TeacherBranchNotFoundError extends Error {
  constructor() {
    super('Branch not found');
  }
}

export class TeacherBranchMismatchError extends Error {
  constructor() {
    super('Branch does not belong to the school');
  }
}

export class TeacherUserNotFoundError extends Error {
  constructor() {
    super('User not found');
  }
}

export const teacherService = {
  async createTeacherWithDocuments(input: CreateTeacherDTO): Promise<Teacher> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const school = await School.findByPk(input.school_id, { transaction });
      if (!school) {
        throw new TeacherSchoolNotFoundError();
      }

      if (input.branch_id) {
        const branch = await Branch.findByPk(input.branch_id, { transaction });
        if (!branch) {
          throw new TeacherBranchNotFoundError();
        }
        if (branch.school_id !== input.school_id) {
          throw new TeacherBranchMismatchError();
        }
      }

      if (input.user_id) {
        const user = await User.findByPk(input.user_id, { transaction });
        if (!user) {
          throw new TeacherUserNotFoundError();
        }
      }

      const teacher = await Teacher.create(
        {
          id: generateUuid(),
          school_id: input.school_id,
          branch_id: input.branch_id,
          user_id: input.user_id,
          employee_id: input.employee_id,
        },
        { transaction }
      );

      await Document.bulkCreate(
        input.documents.map((d) => ({
          id: generateUuid(),
          ownerType: 'teacher',
          ownerId: teacher.id,
          type: d.type,
          fileUrl: d.fileUrl,
          fileName: d.fileName ?? null,
          isVerified: false,
        })),
        { transaction }
      );

      return teacher;
    });
  },
};

