import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface EnrollmentAttributes {
  id: string;
  school_id: string;
  student_id: string;
  class_id: string;
  section_id: string;
  academic_year_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type EnrollmentCreationAttributes = Optional<
  EnrollmentAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Enrollment
  extends Model<EnrollmentAttributes, EnrollmentCreationAttributes>
  implements EnrollmentAttributes
{
  declare id: string;
  declare school_id: string;
  declare student_id: string;
  declare class_id: string;
  declare section_id: string;
  declare academic_year_id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Enrollment.init(
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
    academic_year_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'enrollments',
  }
);
