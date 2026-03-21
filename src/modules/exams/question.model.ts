import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface QuestionAttributes {
  id: string;
  exam_subject_id: string;
  question_text: string;
  type: QuestionType;
  options: string[] | null;
  correct_answer: string | string[] | boolean | null;
  marks: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type QuestionCreationAttributes = Optional<QuestionAttributes, 'id' | 'options' | 'correct_answer' | 'createdAt' | 'updatedAt'>;

export class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  declare id: string;
  declare exam_subject_id: string;
  declare question_text: string;
  declare type: QuestionType;
  declare options: string[] | null;
  declare correct_answer: string | string[] | boolean | null;
  declare marks: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Question.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    exam_subject_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('multiple_choice', 'true_false', 'short_answer', 'essay'),
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    correct_answer: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    marks: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'questions',
  }
);
