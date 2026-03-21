import { Request, Response } from 'express';
import {
  ParentEmailExistsError,
  ParentNotFoundError,
  SchoolNotFoundError,
  parentService,
} from './parent.service';
import { createParentSchema, updateParentSchema } from './parent.validation';
import { CreateParentDTO, UpdateParentDTO } from './parent.types';

export const createParent = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createParentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const actorRole = req.user?.role;
  const actorSchoolId = req.user?.school_id ?? null;
  const targetSchoolId = (value as CreateParentDTO).school_id;

  if (actorRole !== 'super_admin' && actorSchoolId !== targetSchoolId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const parent = await parentService.createParent(value as CreateParentDTO);
    res.status(201).json({
      message: 'Parent created successfully',
      data: parent,
    });
  } catch (error) {
    if (error instanceof SchoolNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof ParentEmailExistsError) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getParent = async (req: Request, res: Response): Promise<void> => {
  try {
    const parent = await parentService.getParentById(req.params.id);
    if (!parent) {
      res.status(404).json({ message: 'Parent not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && parent.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: parent });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateParent = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateParentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const existing = await parentService.getParentById(req.params.id);
    if (!existing) {
      res.status(404).json({ message: 'Parent not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && existing.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const parent = await parentService.updateParent(req.params.id, value as UpdateParentDTO);
    res.status(200).json({
      message: 'Parent updated successfully',
      data: parent,
    });
  } catch (error) {
    if (error instanceof ParentNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error instanceof ParentEmailExistsError) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteParent = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await parentService.getParentById(req.params.id);
    if (!existing) {
      res.status(404).json({ message: 'Parent not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && existing.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await parentService.deleteParent(req.params.id);
    res.status(200).json({ message: 'Parent deleted successfully' });
  } catch (error) {
    if (error instanceof ParentNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
