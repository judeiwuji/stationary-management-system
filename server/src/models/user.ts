import { Optional } from "sequelize";
import { Column, DataType, Table, Model, HasMany } from "sequelize-typescript";
import Requisition from "./requisition";
import { Roles } from "./role";

export interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: number;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

@Table
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  firstname!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  lastname!: string;

  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.CHAR(60),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role!: number;

  @HasMany(() => Requisition)
  requistions!: Requisition[];
}
