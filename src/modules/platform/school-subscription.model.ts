import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface SchoolSubscriptionAttributes {
  id: string;
  school_id: string;
  plan_id: string;
  start_date: Date;
  end_date: Date | null;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type SchoolSubscriptionCreationAttributes = Optional<
  SchoolSubscriptionAttributes,
  'id' | 'end_date' | 'createdAt' | 'updatedAt'
>;

export class SchoolSubscription
  extends Model<SchoolSubscriptionAttributes, SchoolSubscriptionCreationAttributes>
  implements SchoolSubscriptionAttributes
{
  declare id: string;
  declare school_id: string;
  declare plan_id: string;
  declare start_date: Date;
  declare end_date: Date | null;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

SchoolSubscription.init(
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
    plan_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'school_subscriptions',
  }
);
