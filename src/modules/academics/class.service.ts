import { Class } from './class.model';
import { School } from '../platform/school.model';
import { generateUuid } from '../../core/utils/uuid';
import { ClassResponse, CreateClassDTO, UpdateClassDTO } from './class.types';

export class SchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export class ClassNotFoundError extends Error {
  constructor() {
    super('Class not found');
  }
}

export const classService = {
  async createClass(input: CreateClassDTO): Promise<ClassResponse> {
    const school = await School.findByPk(input.school_id);
    if (!school) {
      throw new SchoolNotFoundError();
    }

    const clazz = await Class.create({
      id: generateUuid(),
      school_id: input.school_id,
      name: input.name,
    });

    return clazz.get({ plain: true }) as ClassResponse;
  },

  async listClasses(schoolId: string): Promise<ClassResponse[]> {
    const classes = await Class.findAll({ where: { school_id: schoolId } });
    return classes.map((clazz) => clazz.get({ plain: true }) as ClassResponse);
  },

  async getClassById(id: string): Promise<ClassResponse | null> {
    const clazz = await Class.findByPk(id);
    return clazz ? (clazz.get({ plain: true }) as ClassResponse) : null;
  },

  async updateClass(id: string, input: UpdateClassDTO): Promise<ClassResponse> {
    const clazz = await Class.findByPk(id);
    if (!clazz) {
      throw new ClassNotFoundError();
    }

    const updated = await clazz.update({
      name: input.name ?? clazz.name,
    });

    return updated.get({ plain: true }) as ClassResponse;
  },

  async deleteClass(id: string): Promise<void> {
    const clazz = await Class.findByPk(id);
    if (!clazz) {
      throw new ClassNotFoundError();
    }
    await clazz.destroy();
  },
};
