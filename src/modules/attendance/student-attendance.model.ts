import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface StudentAttendanceAttributes {
  id: string;
  school_id: string;
  student_id: string;
  class_id: string;
  section_id: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  createdAt?: Date;
  updatedAt?: Date;
}

type StudentAttendanceCreationAttributes = Optional<
  StudentAttendanceAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class StudentAttendance
  extends Model<StudentAttendanceAttributes, StudentAttendanceCreationAttributes>
  implements StudentAttendanceAttributes
{
  declare id: string;
  declare school_id: string;
  declare student_id: string;
  declare class_id: string;
  declare section_id: string;
  declare date: Date;
  declare status: 'present' | 'absent' | 'late' | 'excused';
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentAttendance.init(
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
    class_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    section_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'student_attendance',
    indexes: [
      {
        unique: true,
        fields: ['student_id', 'class_id', 'section_id', 'date'],
      },
    ],
  }
);
