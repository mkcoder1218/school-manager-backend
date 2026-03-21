import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface StudentAnswerAttributes {
  id: string;
  student_id: string;
  question_id: string;
  answer: string | string[] | boolean | null;
  marks_obtained: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type StudentAnswerCreationAttributes = Optional<
  StudentAnswerAttributes,
  'id' | 'marks_obtained' | 'createdAt' | 'updatedAt'
>;

export class StudentAnswer
  extends Model<StudentAnswerAttributes, StudentAnswerCreationAttributes>
  implements StudentAnswerAttributes
{
  declare id: string;
  declare student_id: string;
  declare question_id: string;
  declare answer: string | string[] | boolean | null;
  declare marks_obtained: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentAnswer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    question_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    answer: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    marks_obtained: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'student_answers',
  }
);
