import { Request, Response } from 'express';
import { recordPaymentSchema } from './payment.validation';
import { paymentService, OverpaymentError, StudentFeeNotFoundError } from './payment.service';
import { RecordPaymentDTO } from './payment.types';
import { buildListQuery, buildMeta } from '../../core/utils/query';

const resolveSchoolId = (req: Request): string | null => {
  if (req.user?.role === 'super_admin') {
    return (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const recordPayment = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = recordPaymentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (req.user?.role !== 'super_admin') {
      const ok = await paymentService.studentFeeBelongsToSchool(
        (value as RecordPaymentDTO).student_fee_id,
        schoolId
      );
      if (!ok) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    const payment = await paymentService.recordPayment(value as RecordPaymentDTO);
    res.status(201).json({ message: 'Payment recorded successfully', data: payment });
  } catch (error) {
    if (error instanceof StudentFeeNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error instanceof OverpaymentError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listPayments = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  const studentFeeId = req.query.student_fee_id as string | undefined;
  if (req.user?.role !== 'super_admin' && studentFeeId) {
    const ok = await paymentService.studentFeeBelongsToSchool(studentFeeId, schoolId);
    if (!ok) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
  }

  try {
    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['payment_date', 'createdAt', 'amount_paid'] }
    );
    const result = await paymentService.listPayments({
      school_id: schoolId,
      student_fee_id: studentFeeId,
      limit,
      offset,
      order: orderBy,
      where,
    });
    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (req.user?.role !== 'super_admin') {
      const ok = await paymentService.paymentBelongsToSchool(req.params.id, schoolId);
      if (!ok) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    res.status(200).json({ data: payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
