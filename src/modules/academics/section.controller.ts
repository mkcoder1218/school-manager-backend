import { Request, Response } from 'express';
import { createSectionSchema, updateSectionSchema } from './section.validation';
import { Class } from './class.model';
import { CreateSectionDTO, UpdateSectionDTO } from './section.types';
import { ClassNotFoundError, SectionNotFoundError, sectionService } from './section.service';

const resolveSchoolId = (req: Request, classSchoolId?: string): string | null => {
  if (req.user?.role === 'super_admin') {
    return classSchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const createSection = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createSectionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const clazz = await Class.findByPk((value as CreateSectionDTO).class_id);
    if (!clazz) {
      res.status(400).json({ message: 'Class not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, clazz.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && clazz.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const section = await sectionService.createSection(value as CreateSectionDTO);
    res.status(201).json({ message: 'Section created successfully', data: section });
  } catch (error) {
    if (error instanceof ClassNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listSections = async (req: Request, res: Response): Promise<void> => {
  const classId = req.query.class_id as string | undefined;
  let schoolId: string | null = null;

  if (classId) {
    const clazz = await Class.findByPk(classId);
    if (!clazz) {
      res.status(400).json({ message: 'Class not found' });
      return;
    }
    schoolId = resolveSchoolId(req, clazz.school_id);
  } else {
    schoolId = resolveSchoolId(req);
  }

  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }

  try {
    const sections = await sectionService.listSections(schoolId, classId);
    res.status(200).json({ data: sections });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const section = await sectionService.getSectionById(req.params.id);
    if (!section) {
      res.status(404).json({ message: 'Section not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, section.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && section.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: section });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSection = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateSectionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const section = await sectionService.getSectionById(req.params.id);
    if (!section) {
      res.status(404).json({ message: 'Section not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, section.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && section.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updated = await sectionService.updateSection(req.params.id, value as UpdateSectionDTO);
    res.status(200).json({ message: 'Section updated successfully', data: updated });
  } catch (error) {
    if (error instanceof SectionNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const section = await sectionService.getSectionById(req.params.id);
    if (!section) {
      res.status(404).json({ message: 'Section not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, section.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && section.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await sectionService.deleteSection(req.params.id);
    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    if (error instanceof SectionNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
