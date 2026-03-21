import bcrypt from 'bcrypt';
import { Role } from '../../modules/roles/role.model';
import { User } from '../../modules/users/user.model';
import { UserRole } from '../../modules/rbac/user-role.model';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@platform.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const SALT_ROUNDS = 10;

export const seedSuperAdmin = async (): Promise<void> => {
  const superAdminRole = await Role.findOne({
    where: { name: 'super_admin', school_id: null },
  });

  if (!superAdminRole) {
    // eslint-disable-next-line no-console
    console.log('super_admin role not found; skipping super admin user seed.');
    return;
  }

  const existing = await User.findOne({
    where: { email: DEFAULT_ADMIN_EMAIL },
  });

  if (existing) {
    // eslint-disable-next-line no-console
    console.log(`Super admin user exists: ${DEFAULT_ADMIN_EMAIL}`);
    return;
  }

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, SALT_ROUNDS);

  const user = await User.create({
    school_id: null,
    branch_id: null,
    email: DEFAULT_ADMIN_EMAIL,
    firstName: 'Super',
    lastName: 'Admin',
    phone: null,
    password: passwordHash,
    status: 'active',
  });

  await UserRole.findOrCreate({
    where: {
      user_id: user.id,
      role_id: superAdminRole.id,
      school_id: null,
    },
    defaults: {
      user_id: user.id,
      role_id: superAdminRole.id,
      school_id: null,
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Super admin user created: ${DEFAULT_ADMIN_EMAIL}`);
};
