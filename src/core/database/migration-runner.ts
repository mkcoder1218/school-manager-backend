import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';

type MigrationModule = {
  name?: string;
  up: (args: { sequelize: Sequelize }) => Promise<void>;
};

const resolveMigrationsDir = (): string => {
  const cwd = process.cwd();
  const srcDir = path.resolve(cwd, 'src', 'database', 'migrations');
  if (fs.existsSync(srcDir)) return srcDir;
  return path.resolve(cwd, 'dist', 'database', 'migrations');
};

const ensureMigrationsTable = async (sequelize: Sequelize): Promise<void> => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "migrations" (
      "name" VARCHAR(255) PRIMARY KEY,
      "executed_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const listMigrationFiles = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.js') || f.endsWith('.ts'))
    .filter((f) => !f.endsWith('.d.ts'))
    .sort();
};

export const runMigrations = async (sequelize: Sequelize): Promise<void> => {
  await ensureMigrationsTable(sequelize);

  const dir = resolveMigrationsDir();
  const files = listMigrationFiles(dir);
  if (files.length === 0) return;

  const [rows] = (await sequelize.query(`SELECT "name" FROM "migrations";`)) as unknown as [
    Array<{ name: string }>,
  ];
  const executed = new Set(rows.map((r) => r.name));

  for (const file of files) {
    if (executed.has(file)) continue;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(path.join(dir, file)) as MigrationModule;
    if (!mod?.up) {
      throw new Error(`Invalid migration module: ${file}`);
    }

    await mod.up({ sequelize });
    await sequelize.query(`INSERT INTO "migrations" ("name") VALUES (:name);`, { replacements: { name: file } });
  }
};

