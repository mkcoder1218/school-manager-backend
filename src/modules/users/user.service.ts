import bcrypt from 'bcrypt';
import { User } from './user.model';
import { Role } from '../roles/role.model';
import { UserRole } from '../rbac/user-role.model';
import { Branch } from '../organization/branch.model';
import { generateUuid } from '../../core/utils/uuid';
import { CreateUserDTO, UserDirectoryItem, UserResponse } from './user.types';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { Message } from '../communication/message.model';

export class EmailExistsError extends Error {
  constructor() {
    super('Email already exists');
  }
}

export class RoleNotFoundError extends Error {
  constructor() {
    super('Role not found');
  }
}

export class BranchMismatchError extends Error {
  constructor() {
    super('Branch does not belong to the school');
  }
}

export class BranchNotFoundError extends Error {
  constructor() {
    super('Branch not found');
  }
}

export const userService = {
  async createUser(input: CreateUserDTO): Promise<UserResponse> {
    const existing = await User.findOne({ where: { email: input.email } });
    if (existing) {
      throw new EmailExistsError();
    }

    const role = await Role.findOne({ where: { name: input.role } });
    if (!role) {
      throw new RoleNotFoundError();
    }

    const branch = await Branch.findByPk(input.branch_id);
    if (!branch) {
      throw new BranchNotFoundError();
    }

    if (branch.school_id !== input.school_id) {
      throw new BranchMismatchError();
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await User.create({
      id: generateUuid(),
      school_id: input.school_id,
      branch_id: input.branch_id,
      email: input.email,
      firstName: input.first_name,
      lastName: input.last_name,
      phone: input.phone,
      password: passwordHash,
      status: 'active',
    });

    await UserRole.create({
      id: generateUuid(),
      user_id: user.id,
      role_id: role.id,
      school_id: input.school_id,
    });

    return {
      id: user.id,
      email: user.email,
      role: input.role,
      branch_id: input.branch_id,
    };
  },

  async getUserMessages(userId: string): Promise<{ sent: number; received: number }> {
    const sent = await Message.count({ where: { sender_id: userId } });
    const received = await Message.count({ where: { receiver_id: userId } });
    return { sent, received };
  },
  async listUsers(options: {
    actorRole: string | undefined;
    actorSchoolId: string | null;
    actorUserId?: string;
    actorBranchId?: string | null;
    where?: WhereOptions;
    order?: FindOptions['order'];
    limit?: number;
    offset?: number;
  }): Promise<{ rows: UserDirectoryItem[]; count: number }> {
    let baseWhere: WhereOptions =
      options.actorRole === 'super_admin' ? {} : { school_id: options.actorSchoolId };

    if (options.actorRole === 'school_admin') {
      baseWhere = { ...baseWhere, branch_id: options.actorBranchId ?? null };
    }

    if (options.actorUserId) {
      baseWhere = { ...baseWhere, id: { [Op.ne]: options.actorUserId } };
    }
    const result = await User.findAndCountAll({
      where: { ...baseWhere, ...options.where },
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
      order: options.order,
      limit: options.limit,
      offset: options.offset,
    });

    let rows = result.rows.map((user) => {
      const roles = (user as User & { Roles?: Role[] }).Roles ?? [];
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        status: user.status,
        school_id: user.school_id,
        branch_id: user.branch_id,
        roles: roles.map((role) => role.name),
      };
    });

    if (options.actorRole === 'school_admin') {
      rows = rows.filter(
        (user) => !user.roles.includes('school_owner') && !user.roles.includes('super_admin')
      );
    }

    return { rows, count: rows.length };
  },
};
