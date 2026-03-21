import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface TimetableAttributes {
  id: string;
  school_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  exam_id: string | null;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type TimetableCreationAttributes = Optional<TimetableAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Timetable
  extends Model<TimetableAttributes, TimetableCreationAttributes>
  implements TimetableAttributes
{
  declare id: string;
  declare school_id: string;
  declare class_id: string;
  declare section_id: string;
  declare subject_id: string;
  declare teacher_id: string;
  declare exam_id: string | null;
  declare day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  declare start_time: string;
  declare end_time: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Timetable.init(
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
    section_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    exam_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    day: {
      type: DataTypes.ENUM(
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ),
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
  },
  {
    sequelize,
    tableName: 'timetables',
  }
);
