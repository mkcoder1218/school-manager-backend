export type PaymentStatus = 'pending' | 'paid' | 'free';

export interface CreateParentDTO {
  first_name: string;
  last_name: string;
  school_id: string;
  email?: string | null;
  phone: string;
  alternative_phone?: string | null;
  address: string;
  occupation?: string | null;
  employer?: string | null;
  parent_subscription_required?: boolean;
  subscription_start_date?: string | null; // YYYY-MM-DD
  subscription_end_date?: string | null; // YYYY-MM-DD
  payment_status?: PaymentStatus;
}

export interface UpdateParentDTO {
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string;
  alternative_phone?: string | null;
  address?: string;
  occupation?: string | null;
  employer?: string | null;
  parent_subscription_required?: boolean;
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;
  payment_status?: PaymentStatus;
}

export interface ParentResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  alternative_phone: string | null;
  address: string;
  occupation: string | null;
  employer: string | null;
  school_id: string;
  parent_subscription_required: boolean;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  payment_status: PaymentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
