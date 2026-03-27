import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const hasColumn = async (qi: QueryInterface, table: string, column: string): Promise<boolean> => {
  const desc = await qi.describeTable(table);
  return Boolean(desc[column]);
};

const backfillStudentIds = async (sequelize: Sequelize): Promise<void> => {
  // Keep it deterministic-ish for uniqueness but safe.
  // Batch updates to avoid giant transactions.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [rows] = (await sequelize.query(
      `SELECT id FROM "students" WHERE "student_id" IS NULL LIMIT 500;`
    )) as unknown as [Array<{ id: string }>];
    if (rows.length === 0) break;

    for (const r of rows) {
      const sid = `STU-${uuidv4().split('-')[0].toUpperCase()}`;
      await sequelize.query(`UPDATE "students" SET "student_id" = :sid WHERE "id" = :id;`, {
        replacements: { sid, id: r.id },
      });
    }
  }
};

const backfillParentPhones = async (sequelize: Sequelize): Promise<void> => {
  // Some legacy data may have NULL phone; backfill with placeholders so NOT NULL + unique index works.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [rows] = (await sequelize.query(`SELECT id FROM "parents" WHERE "phone" IS NULL LIMIT 500;`)) as unknown as [
      Array<{ id: string }>,
    ];
    if (rows.length === 0) break;

    for (const r of rows) {
      const phone = `UNKNOWN-${uuidv4().split('-')[0].toUpperCase()}`;
      await sequelize.query(`UPDATE "parents" SET "phone" = :phone WHERE "id" = :id;`, {
        replacements: { phone, id: r.id },
      });
    }
  }
};

export const up = async ({ sequelize }: { sequelize: Sequelize }): Promise<void> => {
  const qi = sequelize.getQueryInterface();

  // students
  if (!(await hasColumn(qi, 'students', 'student_id'))) {
    await qi.addColumn('students', 'student_id', { type: DataTypes.STRING(64), allowNull: true });
    await backfillStudentIds(sequelize);
    await qi.changeColumn('students', 'student_id', {
      type: DataTypes.STRING(64),
      allowNull: false,
    });
    await qi.addIndex('students', ['student_id'], { unique: true, name: 'students_student_id_uq' });
  }

  const studentAdds: Array<[string, unknown]> = [
    ['middle_name', { type: DataTypes.STRING(120), allowNull: true }],
    ['email', { type: DataTypes.STRING(320), allowNull: true }],
    ['grade', { type: DataTypes.STRING(64), allowNull: true }],
    ['section', { type: DataTypes.STRING(64), allowNull: true }],
    ['academic_year', { type: DataTypes.STRING(32), allowNull: true }],
    ['enrollment_date', { type: DataTypes.DATEONLY, allowNull: true }],
    ['status', { type: DataTypes.STRING(32), allowNull: true }],
    ['nationality', { type: DataTypes.STRING(120), allowNull: true }],
    ['place_of_birth', { type: DataTypes.STRING(200), allowNull: true }],
    ['blood_group', { type: DataTypes.STRING(8), allowNull: true }],
    ['medical_conditions', { type: DataTypes.STRING(1000), allowNull: true }],
    ['allergies', { type: DataTypes.STRING(1000), allowNull: true }],
  ];

  for (const [col, def] of studentAdds) {
    if (!(await hasColumn(qi, 'students', col))) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await qi.addColumn('students', col, def as any);
    }
  }

  // Admission number now optional
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await qi.changeColumn('students', 'admission_number', { type: DataTypes.STRING(64), allowNull: true } as any);
  } catch {
    // ignore (column might not exist or dialect differences)
  }

  // backfill required student registration fields (best-effort)
  await sequelize.query(`UPDATE "students" SET "grade" = COALESCE("grade", '1') WHERE "grade" IS NULL;`);
  await sequelize.query(`UPDATE "students" SET "section" = COALESCE("section", 'A') WHERE "section" IS NULL;`);
  await sequelize.query(
    `UPDATE "students" SET "academic_year" = COALESCE("academic_year", '2025/2026') WHERE "academic_year" IS NULL;`
  );
  await sequelize.query(
    `UPDATE "students" SET "enrollment_date" = COALESCE("enrollment_date", CURRENT_DATE) WHERE "enrollment_date" IS NULL;`
  );
  await sequelize.query(
    `UPDATE "students" SET "status" = COALESCE("status", 'active') WHERE "status" IS NULL;`
  );

  // parents
  const parentAdds: Array<[string, unknown]> = [
    ['alternative_phone', { type: DataTypes.STRING(32), allowNull: true }],
    ['address', { type: DataTypes.STRING(512), allowNull: true }],
    ['occupation', { type: DataTypes.STRING(200), allowNull: true }],
    ['employer', { type: DataTypes.STRING(200), allowNull: true }],
  ];
  for (const [col, def] of parentAdds) {
    if (!(await hasColumn(qi, 'parents', col))) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await qi.addColumn('parents', col, def as any);
    }
  }

  await backfillParentPhones(sequelize);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await qi.changeColumn('parents', 'phone', { type: DataTypes.STRING(32), allowNull: false } as any);
  } catch {
    // ignore
  }
  await sequelize.query(`UPDATE "parents" SET "address" = COALESCE("address", '') WHERE "address" IS NULL;`);

  try {
    await qi.addIndex('parents', ['phone'], { name: 'parents_phone_idx' });
  } catch {
    // ignore if exists
  }
  try {
    await qi.addIndex('parents', ['school_id', 'phone'], { unique: true, name: 'parents_school_phone_uq' });
  } catch {
    // ignore if exists
  }

  // student_parents
  if (!(await hasColumn(qi, 'student_parents', 'is_primary_contact'))) {
    await qi.addColumn('student_parents', 'is_primary_contact', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }
  if (!(await hasColumn(qi, 'student_parents', 'is_emergency_contact'))) {
    await qi.addColumn('student_parents', 'is_emergency_contact', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }

  // relationship enum migration (Postgres-safe)
  await sequelize.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_student_parent_relationship') THEN
        CREATE TYPE "enum_student_parent_relationship" AS ENUM ('father', 'mother', 'guardian', 'other');
      END IF;
    END$$;
  `);
  await sequelize.query(`
    UPDATE "student_parents"
    SET "relationship" = 'other'
    WHERE "relationship" IS NULL OR "relationship" NOT IN ('father','mother','guardian','other');
  `);
  await sequelize.query(`
    ALTER TABLE "student_parents"
    ALTER COLUMN "relationship" TYPE "enum_student_parent_relationship"
    USING "relationship"::"enum_student_parent_relationship";
  `);

  try {
    await qi.addIndex('student_parents', ['student_id', 'parent_id'], {
      unique: true,
      name: 'student_parents_student_parent_uq',
    });
  } catch {
    // ignore
  }
};

