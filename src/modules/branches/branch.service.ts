import { Branch } from '../organization/branch.model';
import { School } from '../platform/school.model';
import { generateUuid } from '../../core/utils/uuid';
import { BranchResponse, CreateBranchDTO } from './branch.types';
import { FindOptions, WhereOptions } from 'sequelize';

export class SchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export const branchService = {
  async createBranch(input: CreateBranchDTO): Promise<BranchResponse> {
    const school = await School.findByPk(input.school_id);
    if (!school) {
      throw new SchoolNotFoundError();
    }

    const branch = await Branch.create({
      id: generateUuid(),
      school_id: input.school_id,
      name: input.name,
      address: input.address,
      phone: input.phone,
    });

    return branch.get({ plain: true }) as BranchResponse;
  },
  async updateBranch(
    id: string,
    input: Partial<CreateBranchDTO>
  ): Promise<BranchResponse | null> {
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return null;
    }
    await branch.update({
      name: input.name ?? branch.name,
      address: input.address ?? branch.address,
      phone: input.phone ?? branch.phone,
      school_id: input.school_id ?? branch.school_id,
    });
    return branch.get({ plain: true }) as BranchResponse;
  },
  async deleteBranch(id: string): Promise<boolean> {
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return false;
    }
    await branch.destroy();
    return true;
  },
  async listBranches(options?: {
    schoolId?: string | null;
    where?: WhereOptions;
    order?: FindOptions['order'];
    limit?: number;
    offset?: number;
  }): Promise<{ rows: BranchResponse[]; count: number }> {
    const whereClause = options?.schoolId ? { ...options.where, school_id: options.schoolId } : options?.where;
    const result = await Branch.findAndCountAll({
      where: whereClause,
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((branch) => branch.get({ plain: true }) as BranchResponse),
      count: result.count,
    };
  },
};
