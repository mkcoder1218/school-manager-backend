import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface AnnouncementAttributes {
  id: string;
  school_id: string;
  title: string;
  message: string;
  target_role: string | null;
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type AnnouncementCreationAttributes = Optional<
  AnnouncementAttributes,
  'id' | 'target_role' | 'createdAt' | 'updatedAt'
>;

export class Announcement
  extends Model<AnnouncementAttributes, AnnouncementCreationAttributes>
  implements AnnouncementAttributes
{
  declare id: string;
  declare school_id: string;
  declare title: string;
  declare message: string;
  declare target_role: string | null;
  declare created_by: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Announcement.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    target_role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'announcements',
  }
);
