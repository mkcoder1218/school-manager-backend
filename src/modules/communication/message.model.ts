import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface MessageAttributes {
  id: string;
  school_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type MessageCreationAttributes = Optional<MessageAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  declare id: string;
  declare school_id: string;
  declare sender_id: string;
  declare receiver_id: string;
  declare message: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Message.init(
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
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'messages',
  }
);
