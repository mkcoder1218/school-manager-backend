import { Role } from '../../modules/roles/role.model';
const GLOBAL_ROLES = [
  'super_admin',
  'school_admin',
  'school_owner',
  'school_principal',
  'teacher',
  'accountant',
  'registrar',
  'librarian',
  'parent',
  'student',
] as const;

export const seedRoles = async (): Promise<void> => {
  for (const name of GLOBAL_ROLES) {
    const existing = await Role.findOne({ where: { name } });
    if (existing) {
      if (existing.school_id !== null) {
        await existing.update({ school_id: null });
        // eslint-disable-next-line no-console
        console.log(`Role updated (global): ${existing.name}`);
        continue;
      }
      // eslint-disable-next-line no-console
      console.log(`Role exists (global): ${existing.name}`);
      continue;
    }

    const role = await Role.create({ name, school_id: null });

    // eslint-disable-next-line no-console
    console.log(`Role created (global): ${role.name}`);
  }

};
