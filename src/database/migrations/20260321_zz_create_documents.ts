import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

const tableExists = async (qi: QueryInterface, table: string): Promise<boolean> => {
  try {
    await qi.describeTable(table);
    return true;
  } catch {
    return false;
  }
};

export const up = async ({ sequelize }: { sequelize: Sequelize }): Promise<void> => {
  const qi = sequelize.getQueryInterface();

  if (await tableExists(qi, 'documents')) {
    return;
  }

  await qi.createTable('documents', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    ownerType: {
      type: DataTypes.ENUM('student', 'teacher'),
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('id_card', 'certificate', 'cv', 'license', 'medical', 'other'),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });

  await qi.addIndex('documents', ['ownerType', 'ownerId'], { name: 'documents_owner_idx' });
  await qi.addIndex('documents', ['type'], { name: 'documents_type_idx' });
};

