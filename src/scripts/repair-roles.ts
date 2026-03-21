import { sequelize } from '../core/database/sequelize';
import { initModels } from '../models';
import { seedRoles } from '../database/seeders/role.seed';

const run = async (): Promise<void> => {
  try {
    initModels();
    await sequelize.authenticate();
    await seedRoles();
    await sequelize.close();
    // eslint-disable-next-line no-console
    console.log('Role repair completed.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Role repair failed:', error);
    try {
      await sequelize.close();
    } catch {
      // ignore close errors
    }
    process.exit(1);
  }
};

void run();
