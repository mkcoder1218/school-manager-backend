import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface LibraryBookAttributes {
  id: string;
  school_id: string;
  title: string;
  author: string;
  isbn: string;
  total_copies: number;
  available_copies: number;
  category: string;
  status: 'available' | 'borrowed' | 'reserved';
  createdAt?: Date;
  updatedAt?: Date;
}

type LibraryBookCreationAttributes = Optional<
  LibraryBookAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class LibraryBook
  extends Model<LibraryBookAttributes, LibraryBookCreationAttributes>
  implements LibraryBookAttributes
{
  declare id: string;
  declare school_id: string;
  declare title: string;
  declare author: string;
  declare isbn: string;
  declare total_copies: number;
  declare available_copies: number;
  declare category: string;
  declare status: 'available' | 'borrowed' | 'reserved';
  declare createdAt: Date;
  declare updatedAt: Date;
}

LibraryBook.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_copies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    available_copies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'borrowed', 'reserved'),
      allowNull: false,
      defaultValue: 'available',
    },
  },
  {
    sequelize,
    tableName: 'library_books',
  }
);
