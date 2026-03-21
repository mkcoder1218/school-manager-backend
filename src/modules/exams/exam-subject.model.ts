import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface ExamSubjectAttributes {
  id: string;
  school_id: string;
  exam_id: string;
  subject_id: string;
  total_marks: number;
  passing_marks: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ExamSubjectCreationAttributes = Optional<
  ExamSubjectAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class ExamSubject
  extends Model<ExamSubjectAttributes, ExamSubjectCreationAttributes>
  implements ExamSubjectAttributes
{
  declare id: string;
  declare school_id: string;
  declare exam_id: string;
  declare subject_id: string;
  declare total_marks: number;
  declare passing_marks: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ExamSubject.init(
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
    exam_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    total_marks: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
    passing_marks: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'exam_subjects',
  }
);
