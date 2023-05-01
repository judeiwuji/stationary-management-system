import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import RequisitionItem from "./requisition_item";
import User from "./user";

export interface ReceiptAttributes {
  id: number;
  requisitionItemId: number;
  userId: number;
  image: string;
  requisitionItem: RequisitionItem;
  user: User;
}

export interface ReceiptCreationAttributes
  extends Optional<ReceiptAttributes, "id" | "requisitionItem" | "user"> {}

@Table
export default class Receipt extends Model<
  ReceiptAttributes,
  ReceiptCreationAttributes
> {
  @ForeignKey(() => RequisitionItem)
  @Column
  requisitionItemId!: number;

  @BelongsTo(() => RequisitionItem)
  item!: RequisitionItem;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.TEXT("medium"),
    allowNull: false,
  })
  image!: string;
}
