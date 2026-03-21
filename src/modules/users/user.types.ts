export interface CreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  school_id: string;
  branch_id: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  branch_id: string;
}

export interface UserDirectoryItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  status: string;
  school_id: string | null;
  branch_id: string | null;
  roles: string[];
}
