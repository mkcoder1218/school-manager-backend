export type PaymentStatus = 'success' | 'failed' | 'pending';

export interface RecordPaymentDTO {
  student_fee_id: string;
  amount_paid: number;
  payment_date: Date;
  payment_method: string;
  status: PaymentStatus;
  receipt_number: string;
}

export interface PaymentResponse {
  id: string;
  student_fee_id: string;
  amount_paid: number;
  payment_date: Date;
  payment_method: string;
  status: PaymentStatus;
  receipt_number: string;
}
