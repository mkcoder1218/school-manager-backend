import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface StudentFeeAttributes {
  id: string;
  school_id: string;
  student_id: string;
  fee_id: string;
  amount: number;
  due_date: Date;
  status: 'pending' | 'paid' | 'overdue';
  createdAt?: Date;
  updatedAt?: Date;
}

type StudentFeeCreationAttributes = Optional<
  StudentFeeAttributes,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export class StudentFee
  extends Model<StudentFeeAttributes, StudentFeeCreationAttributes>
  implements StudentFeeAttributes
{
  declare id: string;
  declare school_id: string;
  declare student_id: string;
  declare fee_id: string;
  declare amount: number;
  declare due_date: Date;
  declare status: 'pending' | 'paid' | 'overdue';
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentFee.init(
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
    fee_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'overdue'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'student_fees',
  }
);
