import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface SectionAttributes {
  id: string;
  school_id: string;
  class_id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type SectionCreationAttributes = Optional<SectionAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Section extends Model<SectionAttributes, SectionCreationAttributes> implements SectionAttributes {
  declare id: string;
  declare school_id: string;
  declare class_id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Section.init(
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
    class_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'sections',
  }
);
