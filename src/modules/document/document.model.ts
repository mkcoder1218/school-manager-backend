import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export type DocumentOwnerType = 'student' | 'teacher';
export type DocumentType = 'id_card' | 'certificate' | 'cv' | 'license' | 'medical' | 'other';

export interface DocumentAttributes {
  id: string;
  ownerType: DocumentOwnerType;
  ownerId: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string | null;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type DocumentCreationAttributes = Optional<
  DocumentAttributes,
  'id' | 'fileName' | 'isVerified' | 'createdAt' | 'updatedAt'
>;

export class Document
  extends Model<DocumentAttributes, DocumentCreationAttributes>
  implements DocumentAttributes
{
  declare id: string;
  declare ownerType: DocumentOwnerType;
  declare ownerId: string;
  declare type: DocumentType;
  declare fileUrl: string;
  declare fileName: string | null;
  declare isVerified: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerType: {
      type: DataTypes.ENUM('student', 'teacher'),
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('id_card', 'certificate', 'cv', 'license', 'medical', 'other'),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'documents',
    timestamps: true,
    indexes: [
      { fields: ['ownerType', 'ownerId'], name: 'documents_owner_idx' },
      { fields: ['type'], name: 'documents_type_idx' },
    ],
  }
);

