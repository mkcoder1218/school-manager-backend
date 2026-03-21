import { Request, Response } from 'express';
import { loginUser } from './auth.service';
import { User } from '../users/user.model';
import { Role } from '../roles/role.model';
import { UserRole } from '../rbac/user-role.model';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const userRoles = await UserRole.findAll({ where: { user_id: user.id } });
    const roleIds = userRoles.map((ur) => ur.role_id);
    const roles = roleIds.length ? await Role.findAll({ where: { id: roleIds } }) : [];
    const roleNames = roles.map((r) => r.name);

    const { token } = await loginUser(
      {
        id: user.id,
        school_id: user.school_id,
        email: user.email,
        password: user.password,
        status: user.status,
      },
      password,
      roleNames,
      []
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: roleNames[0] || null,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      if (error.message === 'JWT_SECRET is not configured') {
        res.status(500).json({ message: 'JWT_SECRET is not configured' });
        return;
      }

      res.status(500).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Unexpected error' });
  }
};
