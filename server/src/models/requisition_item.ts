import {
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import Requisition from "./requisition";
import { DataTypes, Optional } from "sequelize";
import Stock from "./stock";
import Receipt from "./receipt";

export interface RequisitionItemAttributes {
  id: number;
  requisitionId: number;
  price: number;
  quantity: number;
  stockId?: number;
  stock?: Stock;
}

export interface RequisitionItemCreationAttributes
  extends Optional<RequisitionItemAttributes, "id" | "stock"> {}

@Table
export default class RequisitionItem extends Model<
  RequisitionItemAttributes,
  RequisitionItemCreationAttributes
> {
  @ForeignKey(() => Requisition)
  @Column
  requisitionId!: number;
  @BelongsTo(() => Requisition)
  requisition!: Requisition;

  @Column({ allowNull: false, type: DataTypes.DECIMAL(10, 2) })
  price!: number;

  @Column({ allowNull: false, type: DataTypes.INTEGER })
  quantity!: number;

  @ForeignKey(() => Stock)
  @Column({ allowNull: true })
  stockId!: number;

  @BelongsTo(() => Stock)
  stock!: Stock;

  @HasOne(() => Receipt)
  receipt!: Receipt;
}
