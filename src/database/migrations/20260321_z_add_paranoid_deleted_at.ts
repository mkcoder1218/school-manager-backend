import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

const hasColumn = async (qi: QueryInterface, table: string, column: string): Promise<boolean> => {
  const desc = await qi.describeTable(table);
  return Boolean(desc[column]);
};

export const up = async ({ sequelize }: { sequelize: Sequelize }): Promise<void> => {
  const qi = sequelize.getQueryInterface();

  const tables = ['students', 'parents', 'student_parents'] as const;
  for (const table of tables) {
    if (!(await hasColumn(qi, table, 'deletedAt'))) {
      await qi.addColumn(table, 'deletedAt', {
        type: DataTypes.DATE,
        allowNull: true,
      });
    }
  }
};

