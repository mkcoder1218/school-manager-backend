import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface RolePermissionAttributes {
  id: string;
  school_id: string;
  role_id: string;
  permission_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type RolePermissionCreationAttributes = Optional<
  RolePermissionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  declare id: string;
  declare school_id: string;
  declare role_id: string;
  declare permission_id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

RolePermission.init(
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
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'role_permissions',
  }
);
