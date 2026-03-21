import { Op } from 'sequelize';
import { Parent } from '../students/parent.model';
import { Student } from '../students/student.model';
import { School } from '../platform/school.model';
import { generateUuid } from '../../core/utils/uuid';
import { CreateParentDTO, ParentResponse, UpdateParentDTO } from './parent.types';

export class SchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export class ParentNotFoundError extends Error {
  constructor() {
    super('Parent not found');
  }
}

export class ParentEmailExistsError extends Error {
  constructor() {
    super('Parent email already exists for this school');
  }
}

export const parentService = {
  async createParent(input: CreateParentDTO): Promise<ParentResponse> {
    const school = await School.findByPk(input.school_id);
    if (!school) {
      throw new SchoolNotFoundError();
    }

    if (input.email) {
      const existing = await Parent.findOne({
        where: { school_id: input.school_id, email: input.email },
      });
      if (existing) {
        throw new ParentEmailExistsError();
      }
    }

    const parent = await Parent.create({
      id: generateUuid(),
      school_id: input.school_id,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      parent_subscription_required: input.parent_subscription_required ?? false,
      subscription_start_date: input.subscription_start_date ?? null,
      subscription_end_date: input.subscription_end_date ?? null,
      payment_status: input.payment_status ?? 'free',
    });

    return parent.get({ plain: true }) as ParentResponse;
  },

  async getParentById(id: string): Promise<Parent | null> {
    return Parent.findByPk(id, {
      include: [
        {
          model: Student,
          through: { attributes: [] },
        },
      ],
    });
  },

  async updateParent(id: string, input: UpdateParentDTO): Promise<ParentResponse> {
    const parent = await Parent.findByPk(id);
    if (!parent) {
      throw new ParentNotFoundError();
    }

    if (input.email && input.email !== parent.email) {
      const existing = await Parent.findOne({
        where: {
          school_id: parent.school_id,
          email: input.email,
          id: { [Op.ne]: parent.id },
        },
      });
      if (existing) {
        throw new ParentEmailExistsError();
      }
    }

    const updated = await parent.update({
      first_name: input.first_name ?? parent.first_name,
      last_name: input.last_name ?? parent.last_name,
      email: input.email ?? parent.email,
      phone: input.phone ?? parent.phone,
      parent_subscription_required:
        input.parent_subscription_required ?? parent.parent_subscription_required,
      subscription_start_date: input.subscription_start_date ?? parent.subscription_start_date,
      subscription_end_date: input.subscription_end_date ?? parent.subscription_end_date,
      payment_status: input.payment_status ?? parent.payment_status,
    });

    return updated.get({ plain: true }) as ParentResponse;
  },

  async deleteParent(id: string): Promise<void> {
    const parent = await Parent.findByPk(id);
    if (!parent) {
      throw new ParentNotFoundError();
    }

    await parent.destroy();
  },
};
