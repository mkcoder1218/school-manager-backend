import { Payment } from '../finance/payment.model';
import { StudentFee } from '../finance/student-fee.model';
import { generateUuid } from '../../core/utils/uuid';
import { PaymentResponse, RecordPaymentDTO } from './payment.types';
import { FindOptions, WhereOptions } from 'sequelize';

export class StudentFeeNotFoundError extends Error {
  constructor() {
    super('Student fee not found');
  }
}

export class OverpaymentError extends Error {
  constructor() {
    super('Payment exceeds remaining balance');
  }
}

export const paymentService = {
  async recordPayment(input: RecordPaymentDTO): Promise<PaymentResponse> {
    const studentFee = await StudentFee.findByPk(input.student_fee_id);
    if (!studentFee) {
      throw new StudentFeeNotFoundError();
    }

    const payments = await Payment.findAll({
      where: { student_fee_id: input.student_fee_id, status: 'success' },
    });
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const feeAmount = Number(studentFee.amount);
    if (totalPaid + input.amount_paid > feeAmount) {
      throw new OverpaymentError();
    }

    const payment = await Payment.create({
      id: generateUuid(),
      school_id: studentFee.school_id,
      student_fee_id: input.student_fee_id,
      amount_paid: input.amount_paid,
      payment_date: input.payment_date,
      payment_method: input.payment_method,
      status: input.status,
      receipt_number: input.receipt_number,
    });

    if (input.status === 'success') {
      const newTotal = totalPaid + input.amount_paid;
      if (newTotal >= feeAmount) {
        await studentFee.update({ status: 'paid' });
      }
    }

    return {
      id: payment.id,
      student_fee_id: payment.student_fee_id,
      amount_paid: Number(payment.amount_paid),
      payment_date: payment.payment_date,
      payment_method: payment.payment_method,
      status: payment.status,
      receipt_number: payment.receipt_number,
    };
  },

  async listPayments(filters: {
    school_id: string;
    student_fee_id?: string;
    limit?: number;
    offset?: number;
    order?: FindOptions['order'];
    where?: WhereOptions;
  }): Promise<{ rows: PaymentResponse[]; count: number }> {
    const where: Record<string, unknown> = { school_id: filters.school_id, ...(filters.where ?? {}) };
    if (filters.student_fee_id) {
      where.student_fee_id = filters.student_fee_id;
    }
    const result = await Payment.findAndCountAll({
      where,
      order: filters.order,
      limit: filters.limit,
      offset: filters.offset,
    });
    const rows = result.rows.map((payment) => ({
      id: payment.id,
      student_fee_id: payment.student_fee_id,
      amount_paid: Number(payment.amount_paid),
      payment_date: payment.payment_date,
      payment_method: payment.payment_method,
      status: payment.status,
      receipt_number: payment.receipt_number,
    }));
    return { rows, count: result.count };
  },

  async getPaymentById(id: string): Promise<PaymentResponse | null> {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return null;
    }
    return {
      id: payment.id,
      student_fee_id: payment.student_fee_id,
      amount_paid: Number(payment.amount_paid),
      payment_date: payment.payment_date,
      payment_method: payment.payment_method,
      status: payment.status,
      receipt_number: payment.receipt_number,
    };
  },

  async paymentBelongsToSchool(id: string, schoolId: string): Promise<boolean> {
    const payment = await Payment.findByPk(id);
    return !!payment && payment.school_id === schoolId;
  },

  async studentFeeBelongsToSchool(id: string, schoolId: string): Promise<boolean> {
    const studentFee = await StudentFee.findByPk(id);
    return !!studentFee && studentFee.school_id === schoolId;
  },
};
