import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface ExamAttributes {
  id: string;
  school_id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  exam_date: Date;
  start_time: string;
  end_time: string;
  type: 'online' | 'offline';
  createdAt?: Date;
  updatedAt?: Date;
}

type ExamCreationAttributes = Optional<ExamAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Exam extends Model<ExamAttributes, ExamCreationAttributes> implements ExamAttributes {
  declare id: string;
  declare school_id: string;
  declare academic_year_id: string;
  declare class_id: string;
  declare section_id: string;
  declare name: string;
  declare start_date: Date;
  declare end_date: Date;
  declare exam_date: Date;
  declare start_time: string;
  declare end_time: string;
  declare type: 'online' | 'offline';
  declare createdAt: Date;
  declare updatedAt: Date;
}

Exam.init(
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
    academic_year_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    section_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    exam_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('online', 'offline'),
      allowNull: false,
      defaultValue: 'offline',
    },
  },
  {
    sequelize,
    tableName: 'exams',
  }
);
