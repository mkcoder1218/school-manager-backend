import { Request, Response } from 'express';
import { classService, ClassNotFoundError, SchoolNotFoundError } from './class.service';
import { createClassSchema, updateClassSchema } from './class.validation';
import { CreateClassDTO, UpdateClassDTO } from './class.types';

const resolveSchoolId = (req: Request, bodySchoolId?: string): string | null => {
  if (req.user?.role === 'super_admin') {
    return bodySchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const createClass = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createClassSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const schoolId = resolveSchoolId(req, (value as CreateClassDTO).school_id);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }
  if (req.user?.role !== 'super_admin' && schoolId !== (value as CreateClassDTO).school_id) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const clazz = await classService.createClass(value as CreateClassDTO);
    res.status(201).json({ message: 'Class created successfully', data: clazz });
  } catch (error) {
    if (error instanceof SchoolNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listClasses = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }

  try {
    const classes = await classService.listClasses(schoolId);
    res.status(200).json({ data: classes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const clazz = await classService.getClassById(req.params.id);
    if (!clazz) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, clazz.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && clazz.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: clazz });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateClass = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateClassSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const clazz = await classService.getClassById(req.params.id);
    if (!clazz) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, clazz.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && clazz.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updated = await classService.updateClass(req.params.id, value as UpdateClassDTO);
    res.status(200).json({ message: 'Class updated successfully', data: updated });
  } catch (error) {
    if (error instanceof ClassNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const clazz = await classService.getClassById(req.params.id);
    if (!clazz) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, clazz.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && clazz.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await classService.deleteClass(req.params.id);
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    if (error instanceof ClassNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
