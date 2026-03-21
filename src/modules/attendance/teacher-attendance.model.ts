import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface TeacherAttendanceAttributes {
  id: string;
  school_id: string;
  teacher_id: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  createdAt?: Date;
  updatedAt?: Date;
}

type TeacherAttendanceCreationAttributes = Optional<
  TeacherAttendanceAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class TeacherAttendance
  extends Model<TeacherAttendanceAttributes, TeacherAttendanceCreationAttributes>
  implements TeacherAttendanceAttributes
{
  declare id: string;
  declare school_id: string;
  declare teacher_id: string;
  declare date: Date;
  declare status: 'present' | 'absent' | 'late' | 'excused';
  declare createdAt: Date;
  declare updatedAt: Date;
}

TeacherAttendance.init(
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
    tableName: 'teacher_attendance',
    indexes: [
      {
        unique: true,
        fields: ['teacher_id', 'date'],
      },
    ],
  }
);
