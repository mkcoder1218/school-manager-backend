import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../core/database/sequelize';

export interface BookBorrowAttributes {
  id: string;
  school_id: string;
  book_id: string;
  student_id: string;
  borrow_date: Date;
  return_date: Date | null;
  status: 'borrowed' | 'returned' | 'overdue';
  createdAt?: Date;
  updatedAt?: Date;
}

type BookBorrowCreationAttributes = Optional<
  BookBorrowAttributes,
  'id' | 'return_date' | 'status' | 'createdAt' | 'updatedAt'
>;

export class BookBorrow
  extends Model<BookBorrowAttributes, BookBorrowCreationAttributes>
  implements BookBorrowAttributes
{
  declare id: string;
  declare school_id: string;
  declare book_id: string;
  declare student_id: string;
  declare borrow_date: Date;
  declare return_date: Date | null;
  declare status: 'borrowed' | 'returned' | 'overdue';
  declare createdAt: Date;
  declare updatedAt: Date;
}

BookBorrow.init(
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
    book_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    borrow_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
      allowNull: false,
      defaultValue: 'borrowed',
    },
  },
  {
    sequelize,
    tableName: 'book_borrows',
  }
);
