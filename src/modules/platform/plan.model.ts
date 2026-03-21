import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface PlanAttributes {
  id: string;
  name: string;
  price: number;
  student_limit: number;
  branch_limit: number;
  features: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type PlanCreationAttributes = Optional<
  PlanAttributes,
  'id' | 'features' | 'createdAt' | 'updatedAt'
>;

export class Plan extends Model<PlanAttributes, PlanCreationAttributes> implements PlanAttributes {
  declare id: string;
  declare name: string;
  declare price: number;
  declare student_limit: number;
  declare branch_limit: number;
  declare features: Record<string, unknown> | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Plan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    student_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branch_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'plans',
  }
);
