import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface ParentAttributes {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  parent_subscription_required: boolean;
  subscription_start_date: Date | null;
  subscription_end_date: Date | null;
  payment_status: 'pending' | 'paid' | 'free';
  createdAt?: Date;
  updatedAt?: Date;
}

type ParentCreationAttributes = Optional<
  ParentAttributes,
  | 'id'
  | 'phone'
  | 'email'
  | 'parent_subscription_required'
  | 'subscription_start_date'
  | 'subscription_end_date'
  | 'payment_status'
  | 'createdAt'
  | 'updatedAt'
>;

export class Parent extends Model<ParentAttributes, ParentCreationAttributes> implements ParentAttributes {
  declare id: string;
  declare school_id: string;
  declare first_name: string;
  declare last_name: string;
  declare phone: string | null;
  declare email: string | null;
  declare parent_subscription_required: boolean;
  declare subscription_start_date: Date | null;
  declare subscription_end_date: Date | null;
  declare payment_status: 'pending' | 'paid' | 'free';
  declare createdAt: Date;
  declare updatedAt: Date;
}

Parent.init(
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
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parent_subscription_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    subscription_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    subscription_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'free'),
      allowNull: false,
      defaultValue: 'free',
    },
  },
  {
    sequelize,
    tableName: 'parents',
    indexes: [
      {
        unique: true,
        fields: ['school_id', 'email'],
      },
    ],
  }
);
