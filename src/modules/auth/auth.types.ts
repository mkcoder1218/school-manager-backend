export interface AuthUser {
  id: string;
  school_id: string | null;
  email: string;
  password: string;
  status: string;
}

export interface Role {
  id: string;
  school_id: string;
  name: string;
  description?: string | null;
}

export interface Permission {
  id: string;
  name: string;
  description?: string | null;
}

export interface JwtPayload {
  sub: string;
  school_id: string | null;
  schoolId?: string | null;
  roles: string[];
  permissions: string[];
}
