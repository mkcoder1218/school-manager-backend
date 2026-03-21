import { Section } from './section.model';
import { Class } from './class.model';
import { generateUuid } from '../../core/utils/uuid';
import { CreateSectionDTO, SectionResponse, UpdateSectionDTO } from './section.types';

export class ClassNotFoundError extends Error {
  constructor() {
    super('Class not found');
  }
}

export class SectionNotFoundError extends Error {
  constructor() {
    super('Section not found');
  }
}

export const sectionService = {
  async createSection(input: CreateSectionDTO): Promise<SectionResponse> {
    const clazz = await Class.findByPk(input.class_id);
    if (!clazz) {
      throw new ClassNotFoundError();
    }

    const section = await Section.create({
      id: generateUuid(),
      school_id: clazz.school_id,
      class_id: input.class_id,
      name: input.name,
    });

    return section.get({ plain: true }) as SectionResponse;
  },

  async listSections(schoolId: string, classId?: string): Promise<SectionResponse[]> {
    const where: Record<string, unknown> = { school_id: schoolId };
    if (classId) {
      where.class_id = classId;
    }
    const sections = await Section.findAll({ where });
    return sections.map((section) => section.get({ plain: true }) as SectionResponse);
  },

  async getSectionById(id: string): Promise<SectionResponse | null> {
    const section = await Section.findByPk(id);
    return section ? (section.get({ plain: true }) as SectionResponse) : null;
  },

  async updateSection(id: string, input: UpdateSectionDTO): Promise<SectionResponse> {
    const section = await Section.findByPk(id);
    if (!section) {
      throw new SectionNotFoundError();
    }

    const updated = await section.update({
      name: input.name ?? section.name,
    });

    return updated.get({ plain: true }) as SectionResponse;
  },

  async deleteSection(id: string): Promise<void> {
    const section = await Section.findByPk(id);
    if (!section) {
      throw new SectionNotFoundError();
    }
    await section.destroy();
  },
};
