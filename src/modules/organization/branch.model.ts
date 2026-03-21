import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface BranchAttributes {
  id: string;
  school_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type BranchCreationAttributes = Optional<
  BranchAttributes,
  'id' | 'address' | 'phone' | 'email' | 'createdAt' | 'updatedAt'
>;

export class Branch extends Model<BranchAttributes, BranchCreationAttributes> implements BranchAttributes {
  declare id: string;
  declare school_id: string;
  declare name: string;
  declare address: string | null;
  declare phone: string | null;
  declare email: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Branch.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'branches',
  }
);
