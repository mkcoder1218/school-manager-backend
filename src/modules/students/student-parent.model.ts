import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface StudentParentAttributes {
  id: string;
  school_id: string;
  student_id: string;
  parent_id: string;
  relationship: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type StudentParentCreationAttributes = Optional<
  StudentParentAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class StudentParent
  extends Model<StudentParentAttributes, StudentParentCreationAttributes>
  implements StudentParentAttributes
{
  declare id: string;
  declare school_id: string;
  declare student_id: string;
  declare parent_id: string;
  declare relationship: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentParent.init(
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
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'student_parents',
  }
);
