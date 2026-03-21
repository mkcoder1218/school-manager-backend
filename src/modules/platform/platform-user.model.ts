import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface PlatformUserAttributes {
  id: string;
  email: string;
  password: string;
  role: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type PlatformUserCreationAttributes = Optional<PlatformUserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class PlatformUser
  extends Model<PlatformUserAttributes, PlatformUserCreationAttributes>
  implements PlatformUserAttributes
{
  declare id: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PlatformUser.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'platform_users',
  }
);
