import { Request, Response } from 'express';
import {
  FeeNotFoundError,
  SchoolMismatchError,
  SchoolNotFoundError,
  StudentFeeExistsError,
  StudentFeeNotFoundError,
  StudentNotFoundError,
  feeService,
} from './fee.service';
import {
  assignStudentFeeSchema,
  createFeeSchema,
  updateFeeSchema,
  updateStudentFeeSchema,
} from './fee.validation';
import { buildListQuery, buildMeta } from '../../core/utils/query';
import {
  AssignStudentFeeDTO,
  CreateFeeDTO,
  UpdateFeeDTO,
  UpdateStudentFeeDTO,
} from './fee.types';

const resolveSchoolId = (req: Request, bodySchoolId?: string): string | null => {
  const role = req.user?.role;
  if (role === 'super_admin') {
    return bodySchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const createFee = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createFeeSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const schoolId = resolveSchoolId(req, (value as CreateFeeDTO).school_id);
  if (!schoolId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  if (req.user?.role !== 'super_admin' && schoolId !== (value as CreateFeeDTO).school_id) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const fee = await feeService.createFee(value as CreateFeeDTO);
    res.status(201).json({ message: 'Fee created successfully', data: fee });
  } catch (error) {
    if (error instanceof SchoolNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listFees = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'name', 'amount'] }
    );
    const result = await feeService.listFees(schoolId, {
      where,
      order: orderBy,
      limit,
      offset,
    });
    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFee = async (req: Request, res: Response): Promise<void> => {
  try {
    const fee = await feeService.getFeeById(req.params.id);
    if (!fee) {
      res.status(404).json({ message: 'Fee not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, fee.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && fee.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: fee });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateFee = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateFeeSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const fee = await feeService.getFeeById(req.params.id);
    if (!fee) {
      res.status(404).json({ message: 'Fee not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, fee.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && fee.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updated = await feeService.updateFee(req.params.id, value as UpdateFeeDTO);
    res.status(200).json({ message: 'Fee updated successfully', data: updated });
  } catch (error) {
    if (error instanceof FeeNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFee = async (req: Request, res: Response): Promise<void> => {
  try {
    const fee = await feeService.getFeeById(req.params.id);
    if (!fee) {
      res.status(404).json({ message: 'Fee not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, fee.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && fee.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await feeService.deleteFee(req.params.id);
    res.status(200).json({ message: 'Fee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignStudentFee = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = assignStudentFeeSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const actorRole = req.user?.role;
  const actorSchoolId = req.user?.school_id ?? null;

  try {
    const studentId = (value as AssignStudentFeeDTO).student_id;
    const feeId = (value as AssignStudentFeeDTO).fee_id;

    if (actorRole !== 'super_admin') {
      const studentOk = await feeService.studentBelongsToSchool(studentId, actorSchoolId ?? '');
      const feeOk = await feeService.feeBelongsToSchool(feeId, actorSchoolId ?? '');
      if (!studentOk || !feeOk) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    const studentFee = await feeService.assignFeeToStudent(value as AssignStudentFeeDTO);
    res.status(201).json({ message: 'Student fee assigned successfully', data: studentFee });
  } catch (error) {
    if (
      error instanceof StudentNotFoundError ||
      error instanceof FeeNotFoundError ||
      error instanceof SchoolMismatchError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof StudentFeeExistsError) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listStudentFees = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  const studentId = req.query.student_id as string | undefined;
  if (req.user?.role !== 'super_admin' && studentId) {
    const studentOk = await feeService.studentBelongsToSchool(studentId, schoolId);
    if (!studentOk) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
  }

  try {
    const { page, limit, offset, sort, order, orderBy } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['due_date', 'createdAt', 'amount'] }
    );
    const result = await feeService.listStudentFees({
      school_id: schoolId,
      student_id: studentId,
      limit,
      offset,
      order: orderBy,
    });
    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudentFeeStatus = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateStudentFeeSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const studentFee = await feeService.getStudentFeeById(req.params.id);
    if (!studentFee) {
      res.status(404).json({ message: 'Student fee not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, studentFee.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && studentFee.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updated = await feeService.updateStudentFeeStatus(
      req.params.id,
      value as UpdateStudentFeeDTO
    );
    res.status(200).json({ message: 'Student fee updated successfully', data: updated });
  } catch (error) {
    if (error instanceof StudentFeeNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
