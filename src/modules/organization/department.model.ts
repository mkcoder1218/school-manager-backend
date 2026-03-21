import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface DepartmentAttributes {
  id: string;
  school_id: string;
  branch_id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type DepartmentCreationAttributes = Optional<
  DepartmentAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Department
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes
{
  declare id: string;
  declare school_id: string;
  declare branch_id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Department.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'departments',
  }
);
