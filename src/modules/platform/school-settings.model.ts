import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface SchoolSettingsAttributes {
  id: string;
  school_id: string;
  parent_subscription_enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type SchoolSettingsCreationAttributes = Optional<
  SchoolSettingsAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class SchoolSettings
  extends Model<SchoolSettingsAttributes, SchoolSettingsCreationAttributes>
  implements SchoolSettingsAttributes
{
  declare id: string;
  declare school_id: string;
  declare parent_subscription_enabled: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

SchoolSettings.init(
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
    parent_subscription_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'school_settings',
  }
);
