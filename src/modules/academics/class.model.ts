import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface ClassAttributes {
  id: string;
  school_id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ClassCreationAttributes = Optional<ClassAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  declare id: string;
  declare school_id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Class.init(
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
  },
  {
    sequelize,
    tableName: 'classes',
  }
);
