export interface CreateSchoolDTO {
  name: string;
  email: string;
  phone: string;
  address: string;
  owner: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  create_default_branch?: boolean;
  default_branch_name?: string;
  branch_count?: number;
}

export interface SchoolResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  domain: string;
  owner_user_id: string;
  subscription_status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OwnerResponse {
  id: string;
  email: string;
  role: string;
}

export interface BranchResponse {
  id: string;
  school_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateSchoolDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  subscription_status?: string;
}
