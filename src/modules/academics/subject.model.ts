import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface SubjectAttributes {
  id: string;
  school_id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type SubjectCreationAttributes = Optional<SubjectAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
  declare id: string;
  declare school_id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Subject.init(
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
  },
  {
    sequelize,
    tableName: 'subjects',
  }
);
