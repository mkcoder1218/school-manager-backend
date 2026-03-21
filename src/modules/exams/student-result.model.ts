import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface StudentResultAttributes {
  id: string;
  school_id: string;
  student_id: string;
  exam_subject_id: string;
  score: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type StudentResultCreationAttributes = Optional<
  StudentResultAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class StudentResult
  extends Model<StudentResultAttributes, StudentResultCreationAttributes>
  implements StudentResultAttributes
{
  declare id: string;
  declare school_id: string;
  declare student_id: string;
  declare exam_subject_id: string;
  declare score: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentResult.init(
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
    exam_subject_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'student_results',
  }
);
