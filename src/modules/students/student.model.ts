import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';
import { v4 as uuidv4 } from 'uuid';

export interface StudentAttributes {
  id: string;
  school_id: string;
  branch_id: string;
  student_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  gender: 'male' | 'female';
  date_of_birth: string;
  admission_number: string | null;
  phone: string | null;
  email: string | null;
  address: string;
  grade: string;
  section: string;
  academic_year: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  nationality: string | null;
  place_of_birth: string | null;
  blood_group: string | null;
  medical_conditions: string | null;
  allergies: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type StudentCreationAttributes = Optional<
  StudentAttributes,
  | 'id'
  | 'student_id'
  | 'middle_name'
  | 'admission_number'
  | 'phone'
  | 'email'
  | 'nationality'
  | 'place_of_birth'
  | 'blood_group'
  | 'medical_conditions'
  | 'allergies'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  declare id: string;
  declare school_id: string;
  declare branch_id: string;
  declare student_id: string;
  declare first_name: string;
  declare middle_name: string | null;
  declare last_name: string;
  declare gender: 'male' | 'female';
  declare date_of_birth: string;
  declare admission_number: string | null;
  declare phone: string | null;
  declare email: string | null;
  declare address: string;
  declare grade: string;
  declare section: string;
  declare academic_year: string;
  declare enrollment_date: string;
  declare status: 'active' | 'inactive' | 'graduated' | 'transferred';
  declare nationality: string | null;
  declare place_of_birth: string | null;
  declare blood_group: string | null;
  declare medical_conditions: string | null;
  declare allergies: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

Student.init(
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
    branch_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 64],
      },
    },
    first_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    middle_name: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    admission_number: {
      type: DataTypes.STRING(64),
      allowNull: true,
      validate: {
        len: [1, 64],
      },
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: true,
      validate: {
        len: [7, 32],
      },
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.STRING(512),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    grade: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    section: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    academic_year: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    enrollment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'graduated', 'transferred'),
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    place_of_birth: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    blood_group: {
      type: DataTypes.STRING(8),
      allowNull: true,
      validate: {
        len: [1, 8],
      },
    },
    medical_conditions: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    allergies: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'students',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['student_id'],
      },
      {
        unique: true,
        fields: ['school_id', 'admission_number'],
      },
      {
        fields: ['school_id', 'branch_id'],
      },
      {
        fields: ['status'],
      },
    ],
    hooks: {
      beforeValidate: (student) => {
        if (!student.student_id) {
          student.student_id = `STU-${uuidv4().split('-')[0].toUpperCase()}`;
        }
      },
    },
  }
);
