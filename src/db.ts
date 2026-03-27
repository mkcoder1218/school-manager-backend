import { DataTypes, QueryTypes, Sequelize } from 'sequelize';
import { env } from './config/env';
import { sequelize } from './core/database/sequelize';
import { runMigrations } from './core/database/migration-runner';
import { initModels, models } from './models';
import { seedRoles } from './database/seeders/role.seed';
import { seedSuperAdmin } from './database/seeders/super-admin.seed';
import { TransportRoute } from './modules/operations/transport-route.model';
import { Vehicle } from './modules/operations/vehicle.model';
import { generateUuid } from './core/utils/uuid';
import { Branch } from './modules/organization/branch.model';
import { Department } from './modules/organization/department.model';
import { Class } from './modules/academics/class.model';
import { Teacher } from './modules/teachers/teacher.model';
import { Student } from './modules/students/student.model';

const dbConfig = {
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  pass: env.database.password,
  name: env.database.name,
  nodeEnv: env.nodeEnv,
};
console.log('data', dbConfig.host, dbConfig.name, dbConfig.user);

export { sequelize };

const ensureDatabaseExists = async (): Promise<void> => {
  const adminSequelize = new Sequelize('postgres', dbConfig.user, dbConfig.pass, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: false,
  });

  try {
    const rows = (await adminSequelize.query(
      'SELECT 1 FROM pg_database WHERE datname = :dbName',
      {
        replacements: { dbName: dbConfig.name },
        type: QueryTypes.SELECT,
      }
    )) as Array<{ '?column?'?: number; '1'?: number }>;

    if (rows.length === 0) {
      await adminSequelize.query(`CREATE DATABASE "${dbConfig.name}"`);
      // eslint-disable-next-line no-console
      console.log(`Database created: ${dbConfig.name}`);
    }
  } finally {
    await adminSequelize.close();
  }
};

const ensureRoleSchoolIdNullable = async (): Promise<void> => {
  const queryInterface = sequelize.getQueryInterface();
  try {
    await queryInterface.changeColumn('roles', 'school_id', {
      type: DataTypes.UUID,
      allowNull: true,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Skipping roles.school_id alteration (table may not exist yet).');
  }
};

const ensureUserSchoolIdNullable = async (): Promise<void> => {
  const queryInterface = sequelize.getQueryInterface();
  try {
    await queryInterface.changeColumn('users', 'school_id', {
      type: DataTypes.UUID,
      allowNull: true,
    });
    await queryInterface.changeColumn('user_roles', 'school_id', {
      type: DataTypes.UUID,
      allowNull: true,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Skipping users/user_roles school_id alteration (table may not exist yet).');
  }
};

const seedTransport = async (): Promise<void> => {
  const existing = await TransportRoute.findOne();
  if (existing) {
    return;
  }

  const schools = await models.School.findAll({ attributes: ['id'] });
  if (schools.length === 0) {
    return;
  }
  const schoolId = schools[0].id as string;

  const route1 = await TransportRoute.create({
    id: generateUuid(),
    school_id: schoolId,
    name: 'Route A',
    start_location: 'Central Station',
    end_location: 'Main Campus',
    stops: ['Central Station', 'City Mall', 'Main Campus'],
  });

  const route2 = await TransportRoute.create({
    id: generateUuid(),
    school_id: schoolId,
    name: 'Route B',
    start_location: 'North Gate',
    end_location: 'Main Campus',
    stops: ['North Gate', 'Old Market', 'Main Campus'],
  });

  await Vehicle.bulkCreate([
    {
      id: generateUuid(),
      school_id: schoolId,
      route_id: route1.id,
      vehicle_number: 'BUS-101',
      capacity: 40,
      driver_name: 'Driver One',
      status: 'active',
    },
    {
      id: generateUuid(),
      school_id: schoolId,
      route_id: route2.id,
      vehicle_number: 'BUS-202',
      capacity: 35,
      driver_name: 'Driver Two',
      status: 'active',
    },
  ]);
};

const seedAcademicData = async (): Promise<void> => {
  const schools = await models.School.findAll({ attributes: ['id'] });
  if (schools.length === 0) {
    return;
  }
  const schoolId = schools[0].id as string;

  const existingBranch = await Branch.findOne({ where: { school_id: schoolId } });
  const branch =
    existingBranch ??
    (await Branch.create({
      id: generateUuid(),
      school_id: schoolId,
      name: 'Main Branch',
      address: 'Central Campus',
      phone: '0110000000',
    }));

  const existingDepartment = await Department.findOne({ where: { school_id: schoolId } });
  if (!existingDepartment) {
    await Department.create({
      id: generateUuid(),
      school_id: schoolId,
      branch_id: branch.id,
      name: 'Science Department',
    });
  }

  const existingClass = await Class.findOne({ where: { school_id: schoolId } });
  if (!existingClass) {
    await Class.bulkCreate([
      {
        id: generateUuid(),
        school_id: schoolId,
        name: 'Grade 1',
      },
      {
        id: generateUuid(),
        school_id: schoolId,
        name: 'Grade 2',
      },
    ]);
  }

  const existingTeacher = await Teacher.findOne({ where: { school_id: schoolId } });
  if (!existingTeacher) {
    await Teacher.create({
      id: generateUuid(),
      school_id: schoolId,
      branch_id: branch.id,
      employee_id: `EMP-${Date.now()}`,
    });
  }

  const existingStudent = await Student.findOne({ where: { school_id: schoolId } });
  if (!existingStudent) {
    await Student.create({
      id: generateUuid(),
      school_id: schoolId,
      branch_id: branch.id,
      student_id: `STU-${Date.now()}`,
      first_name: 'Test',
      last_name: 'Student',
      gender: 'male',
      date_of_birth: '2012-01-01',
      admission_number: `ADM-${Date.now()}`,
      address: 'Addis Ababa',
      phone: '0912345678',
      email: null,
      middle_name: null,
      grade: '1',
      section: 'A',
      academic_year: '2025/2026',
      enrollment_date: '2026-03-21',
      status: 'active',
      nationality: null,
      place_of_birth: null,
      blood_group: null,
      medical_conditions: null,
      allergies: null,
    });
  }
};

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    await ensureDatabaseExists();
    await sequelize.authenticate();
  }

  initModels();
  await runMigrations(sequelize);
  await sequelize.sync();
  await ensureRoleSchoolIdNullable();
  await ensureUserSchoolIdNullable();

  if (dbConfig.nodeEnv !== 'production') {
    await seedRoles();
    await seedSuperAdmin();
    await seedTransport();
    await seedAcademicData();
  }

  // eslint-disable-next-line no-console
  console.log(`Database connected: ${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`);
};

export { models };
