import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface TeacherSubjectAttributes {
  id: string;
  school_id: string;
  teacher_id: string;
  subject_id: string;
  class_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type TeacherSubjectCreationAttributes = Optional<
  TeacherSubjectAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class TeacherSubject
  extends Model<TeacherSubjectAttributes, TeacherSubjectCreationAttributes>
  implements TeacherSubjectAttributes
{
  declare id: string;
  declare school_id: string;
  declare teacher_id: string;
  declare subject_id: string;
  declare class_id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

TeacherSubject.init(
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
    teacher_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'teacher_subjects',
  }
);
