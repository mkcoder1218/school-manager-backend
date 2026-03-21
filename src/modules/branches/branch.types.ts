export interface CreateBranchDTO {
  school_id: string;
  name: string;
  address: string;
  phone: string;
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
