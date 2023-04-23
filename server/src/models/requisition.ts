import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import Department from "./department";
import { Optional } from "sequelize";
import RequisitionItem from "./requisition_item";
import Comment from "./comment";

export interface RequisitionAttributes {
  id: number;
  userId: number;
  sourceId: number;
  through: number;
  destination: number;
  description: string;
  status: string;
  items: RequisitionItem[];
}

export interface RequisitionCreationAttributes
  extends Optional<RequisitionAttributes, "id" | "items"> {}

@Table
export default class Requisition extends Model<
  RequisitionAttributes,
  RequisitionCreationAttributes
> {
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

  @Column(DataType.NUMBER)
  through!: number;

  @Column(DataType.NUMBER)
  destination!: number;

  @Column(DataType.STRING(300))
  description!: string;

  @Column(DataType.STRING(40))
  status!: string;

  @HasMany(() => RequisitionItem)
  items!: RequisitionItem[];

  @HasMany(() => Comment)
  comments!: Comment[];
}
