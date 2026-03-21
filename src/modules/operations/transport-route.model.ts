import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface TransportRouteAttributes {
  id: string;
  school_id: string;
  name: string;
  start_location: string;
  end_location: string;
  stops: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

type TransportRouteCreationAttributes = Optional<
  TransportRouteAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class TransportRoute
  extends Model<TransportRouteAttributes, TransportRouteCreationAttributes>
  implements TransportRouteAttributes
{
  declare id: string;
  declare school_id: string;
  declare name: string;
  declare start_location: string;
  declare end_location: string;
  declare stops: string[];
  declare createdAt: Date;
  declare updatedAt: Date;
}

TransportRoute.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    end_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stops: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'transport_routes',
  }
);
