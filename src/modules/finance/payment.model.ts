import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface PaymentAttributes {
  id: string;
  school_id: string;
  student_fee_id: string;
  amount_paid: number;
  payment_method: string;
  status: 'success' | 'failed' | 'pending';
  payment_date: Date;
  receipt_number: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type PaymentCreationAttributes = Optional<
  PaymentAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  declare id: string;
  declare school_id: string;
  declare student_fee_id: string;
  declare amount_paid: number;
  declare payment_method: string;
  declare status: 'success' | 'failed' | 'pending';
  declare payment_date: Date;
  declare receipt_number: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Payment.init(
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
    student_fee_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'pending'),
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    receipt_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'payments',
  }
);
