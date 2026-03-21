import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface TeacherAttributes {
  id: string;
  school_id: string;
  branch_id: string | null;
  user_id: string | null;
  employee_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type TeacherCreationAttributes = Optional<
  TeacherAttributes,
  'id' | 'branch_id' | 'user_id' | 'createdAt' | 'updatedAt'
>;

export class Teacher extends Model<TeacherAttributes, TeacherCreationAttributes> implements TeacherAttributes {
  declare id: string;
  declare school_id: string;
  declare branch_id: string | null;
  declare user_id: string | null;
  declare employee_id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Teacher.init(
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
      allowNull: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'teachers',
  }
);
