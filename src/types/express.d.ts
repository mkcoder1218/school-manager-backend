export {};

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub: string;
        school_id: string | null;
        roles: string[];
        permissions: string[];
      };
      userId?: string;
      user?: {
        user_id: string;
        role: string;
        school_id: string | null;
      };
    }
  }
}
