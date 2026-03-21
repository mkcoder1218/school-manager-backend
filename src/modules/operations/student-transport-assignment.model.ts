import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface StudentTransportAssignmentAttributes {
  id: string;
  school_id: string;
  student_id: string;
  route_id: string;
  vehicle_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type StudentTransportAssignmentCreationAttributes = Optional<
  StudentTransportAssignmentAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class StudentTransportAssignment
  extends Model<StudentTransportAssignmentAttributes, StudentTransportAssignmentCreationAttributes>
  implements StudentTransportAssignmentAttributes
{
  declare id: string;
  declare school_id: string;
  declare student_id: string;
  declare route_id: string;
  declare vehicle_id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentTransportAssignment.init(
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
    route_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vehicle_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'student_transport_assignments',
  }
);
