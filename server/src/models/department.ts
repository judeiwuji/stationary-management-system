import { DataTypes, Optional } from "sequelize";
import { Column, HasMany, Model, Table, Unique } from "sequelize-typescript";
import User from "./user";

export interface DepartmentAttributes {
  id: number;
  name: string;
  users?: User[];
}

export interface DepartmentCreationAttributes
  extends Optional<DepartmentAttributes, "id" | "users"> {}

@Table
export default class Department extends Model<
  DepartmentAttributes,
  DepartmentCreationAttributes
> {
  @Column({
    type: DataTypes.STRING(100),
    unique: true,
  })
  name!: string;
}
