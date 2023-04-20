import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import Department from "./department";
import { Optional } from "sequelize";
import { Roles } from "./role";

interface RequisitionAttributes {
  id: number;
  userId: number;
  sourceId: number;
  throughId: number;
  destinationId: number;
  description: string;
  status: string;
}

interface RequisitionCreationAttributes
  extends Optional<RequisitionAttributes, "id"> {}

@Table
export default class Requisition extends Model<
  RequisitionAttributes,
  RequisitionCreationAttributes
> {
  @Column({
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number;
  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Department)
  @Column
  sourceId!: number;
  @BelongsTo(() => Department)
  department!: Department;

  @Column(DataType.STRING)
  through!: number;

  @Column(DataType.STRING)
  destination!: number;

  @Column(DataType.STRING(300))
  description!: string;

  @Column(DataType.STRING(40))
  status!: string;
}
