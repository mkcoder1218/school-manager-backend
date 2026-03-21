export type PaymentStatus = 'pending' | 'paid' | 'free';

export interface CreateParentDTO {
  first_name: string;
  last_name: string;
  school_id: string;
  email?: string | null;
  phone?: string | null;
  parent_subscription_required?: boolean;
  subscription_start_date?: Date | null;
  subscription_end_date?: Date | null;
  payment_status?: PaymentStatus;
}

export interface UpdateParentDTO {
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string | null;
  parent_subscription_required?: boolean;
  subscription_start_date?: Date | null;
  subscription_end_date?: Date | null;
  payment_status?: PaymentStatus;
}

export interface ParentResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  school_id: string;
  parent_subscription_required: boolean;
  subscription_start_date: Date | null;
  subscription_end_date: Date | null;
  payment_status: PaymentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
