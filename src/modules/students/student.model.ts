import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface StudentAttributes {
  id: string;
  school_id: string;
  branch_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: Date;
  phone: string | null;
  address: string;
  admission_number: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type StudentCreationAttributes = Optional<
  StudentAttributes,
  'id' | 'phone' | 'createdAt' | 'updatedAt'
>;

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  declare id: string;
  declare school_id: string;
  declare branch_id: string;
  declare first_name: string;
  declare last_name: string;
  declare gender: string;
  declare date_of_birth: Date;
  declare phone: string | null;
  declare address: string;
  declare admission_number: string;
  declare createdAt: Date;
  declare updatedAt: Date;
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
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admission_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'students',
    indexes: [
      {
        unique: true,
        fields: ['school_id', 'admission_number'],
      },
    ],
  }
);
