import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface FeeAttributes {
  id: string;
  school_id: string;
  name: string;
  amount: number;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type FeeCreationAttributes = Optional<
  FeeAttributes,
  'id' | 'description' | 'createdAt' | 'updatedAt'
>;

export class Fee extends Model<FeeAttributes, FeeCreationAttributes> implements FeeAttributes {
  declare id: string;
  declare school_id: string;
  declare name: string;
  declare amount: number;
  declare description: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Fee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'fees',
  }
);
