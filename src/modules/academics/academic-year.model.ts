import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface AcademicYearAttributes {
  id: string;
  school_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type AcademicYearCreationAttributes = Optional<
  AcademicYearAttributes,
  'id' | 'is_active' | 'createdAt' | 'updatedAt'
>;

export class AcademicYear
  extends Model<AcademicYearAttributes, AcademicYearCreationAttributes>
  implements AcademicYearAttributes
{
  declare id: string;
  declare school_id: string;
  declare name: string;
  declare start_date: Date;
  declare end_date: Date;
  declare is_active: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

AcademicYear.init(
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
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'academic_years',
  }
);
