import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface UserRoleAttributes {
  id: string;
  school_id: string | null;
  user_id: string;
  role_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserRoleCreationAttributes = Optional<UserRoleAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class UserRole
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>
  implements UserRoleAttributes
{
  declare id: string;
  declare school_id: string | null;
  declare user_id: string;
  declare role_id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserRole.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_roles',
  }
);
