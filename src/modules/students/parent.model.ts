import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface ParentAttributes {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  alternative_phone: string | null;
  email: string | null;
  address: string;
  occupation: string | null;
  employer: string | null;
  parent_subscription_required: boolean;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  payment_status: 'pending' | 'paid' | 'free';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ParentCreationAttributes = Optional<
  ParentAttributes,
  | 'id'
  | 'alternative_phone'
  | 'email'
  | 'occupation'
  | 'employer'
  | 'parent_subscription_required'
  | 'subscription_start_date'
  | 'subscription_end_date'
  | 'payment_status'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;

export class Parent extends Model<ParentAttributes, ParentCreationAttributes> implements ParentAttributes {
  declare id: string;
  declare school_id: string;
  declare first_name: string;
  declare last_name: string;
  declare phone: string;
  declare alternative_phone: string | null;
  declare email: string | null;
  declare address: string;
  declare occupation: string | null;
  declare employer: string | null;
  declare parent_subscription_required: boolean;
  declare subscription_start_date: string | null;
  declare subscription_end_date: string | null;
  declare payment_status: 'pending' | 'paid' | 'free';
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
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
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    last_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 32],
      },
    },
    alternative_phone: {
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
    occupation: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    employer: {
      type: DataTypes.STRING(200),
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
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['school_id', 'phone'],
      },
      {
        fields: ['phone'],
      },
    ],
  }
);
