import bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';
import { School } from '../platform/school.model';
import { Branch } from '../organization/branch.model';
import { PlatformUser } from '../platform/platform-user.model';
import { User } from '../users/user.model';
import { Role } from '../roles/role.model';
import { UserRole } from '../rbac/user-role.model';
import { sequelize } from '../../core/database/sequelize';
import { generateUuid } from '../../core/utils/uuid';
import { BranchResponse, CreateSchoolDTO, OwnerResponse, SchoolResponse, UpdateSchoolDTO } from './school.types';
import { FindOptions } from 'sequelize';

export class OwnerEmailExistsError extends Error {
  constructor() {
    super('Owner email already exists');
  }
}

const deriveDomainFromEmail = (email: string): string => {
  const parts = email.split('@');
  if (parts.length === 2 && parts[1]) {
    return parts[1].toLowerCase();
  }

  return `${email.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.local`;
};

export const schoolService = {
  async createSchool(
    input: CreateSchoolDTO
  ): Promise<{ school: SchoolResponse; owner: OwnerResponse; defaultBranch?: BranchResponse }> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const existingOwner = await User.findOne({
        where: { email: input.owner.email },
        transaction,
      });
      if (existingOwner) {
        throw new OwnerEmailExistsError();
      }

      const passwordHash = await bcrypt.hash(input.owner.password, 10);

      const platformOwner = await PlatformUser.create(
        {
          email: input.owner.email,
          password: passwordHash,
          role: 'school_owner',
          status: 'active',
        },
        { transaction }
      );

      const school = await School.create(
        {
          id: generateUuid(),
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
          domain: deriveDomainFromEmail(input.email),
          owner_user_id: platformOwner.id,
          subscription_status: 'active',
        },
        { transaction }
      );

      const ownerUser = await User.create(
        {
          id: generateUuid(),
          school_id: school.id,
          branch_id: null,
          email: input.owner.email,
          firstName: input.owner.first_name,
          lastName: input.owner.last_name,
          phone: null,
          password: passwordHash,
          status: 'active',
        },
        { transaction }
      );

      const [role] = await Role.findOrCreate({
        where: { name: 'school_owner' },
        defaults: { name: 'school_owner', school_id: null },
        transaction,
      });

      await UserRole.create(
        {
          id: generateUuid(),
          user_id: ownerUser.id,
          role_id: role.id,
          school_id: school.id,
        },
        { transaction }
      );

      let defaultBranch: BranchResponse | undefined;
      const shouldCreateBranch = input.create_default_branch !== false;
      if (shouldCreateBranch) {
        const baseName = input.default_branch_name?.trim() || school.domain || 'Main Branch';
        const count = Math.max(1, Math.min(20, input.branch_count ?? 1));
        for (let i = 1; i <= count; i += 1) {
          const branch = await Branch.create(
            {
              id: generateUuid(),
              school_id: school.id,
              name: count === 1 ? baseName : `${baseName} - ${i}`,
              address: input.address,
              phone: input.phone,
              email: input.email,
            },
            { transaction }
          );
          if (!defaultBranch) {
            defaultBranch = branch.get({ plain: true }) as BranchResponse;
          }
        }
      }

      return {
        school: school.get({ plain: true }) as SchoolResponse,
        owner: {
          id: ownerUser.id,
          email: ownerUser.email,
          role: 'school_owner',
        },
        ...(defaultBranch ? { defaultBranch } : {}),
      };
    });
  },
  async listSchools(options?: FindOptions): Promise<{ rows: SchoolResponse[]; count: number }> {
    const result = await School.findAndCountAll({ ...options });
    return {
      rows: result.rows.map((school) => school.get({ plain: true }) as SchoolResponse),
      count: result.count,
    };
  },
  async updateSchool(id: string, input: UpdateSchoolDTO): Promise<SchoolResponse | null> {
    const school = await School.findByPk(id);
    if (!school) {
      return null;
    }

    await school.update(input);
    return school.get({ plain: true }) as SchoolResponse;
  },
};
