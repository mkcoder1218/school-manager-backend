import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface SchoolAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  domain: string;
  owner_user_id: string;
  subscription_status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type SchoolCreationAttributes = Optional<SchoolAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class School extends Model<SchoolAttributes, SchoolCreationAttributes> implements SchoolAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare address: string;
  declare domain: string;
  declare owner_user_id: string;
  declare subscription_status: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

School.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    owner_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subscription_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'schools',
  }
);
