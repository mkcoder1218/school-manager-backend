import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface VehicleAttributes {
  id: string;
  school_id: string;
  route_id: string;
  vehicle_number: string;
  capacity: number;
  driver_name: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

type VehicleCreationAttributes = Optional<VehicleAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  declare id: string;
  declare school_id: string;
  declare route_id: string;
  declare vehicle_number: string;
  declare capacity: number;
  declare driver_name: string;
  declare status: 'active' | 'inactive';
  declare createdAt: Date;
  declare updatedAt: Date;
}

Vehicle.init(
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
    route_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vehicle_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driver_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'vehicles',
  }
);
