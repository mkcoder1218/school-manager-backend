import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface StudentParentAttributes {
  id: string;
  school_id: string;
  student_id: string;
  parent_id: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  is_primary_contact: boolean;
  is_emergency_contact: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type StudentParentCreationAttributes = Optional<
  StudentParentAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export class StudentParent
  extends Model<StudentParentAttributes, StudentParentCreationAttributes>
  implements StudentParentAttributes
{
  declare id: string;
  declare school_id: string;
  declare student_id: string;
  declare parent_id: string;
  declare relationship: 'father' | 'mother' | 'guardian' | 'other';
  declare is_primary_contact: boolean;
  declare is_emergency_contact: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

StudentParent.init(
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
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    relationship: {
      type: DataTypes.ENUM('father', 'mother', 'guardian', 'other'),
      allowNull: false,
    },
    is_primary_contact: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_emergency_contact: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'student_parents',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['student_id', 'parent_id'],
      },
      {
        fields: ['parent_id'],
      },
      {
        fields: ['student_id'],
      },
    ],
  }
);
