import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Requisition from "./requisition";
import { DataTypes, Optional } from "sequelize";
import Stock from "./stock";

export interface RequistionItemAttributes {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stockId?: number;
  stock?: Stock;
}

export interface RequistionItemCreationAttributes
  extends Optional<RequistionItemAttributes, "id" | "stock"> {}

@Table
export default class RequistionItem extends Model<
  RequistionItemAttributes,
  RequistionItemCreationAttributes
> {
  @ForeignKey(() => Requisition)
  @Column
  requisitionId!: number;
  @BelongsTo(() => Requisition)
  requisition!: Requisition;

  @Column({
    allowNull: false,
    type: DataTypes.STRING(250),
  })
  name!: string;

  @Column({ allowNull: false, type: DataTypes.DECIMAL(10, 2) })
  price!: number;

  @Column({ allowNull: false, type: DataTypes.INTEGER })
  quantity!: number;

  @ForeignKey(() => Stock)
  @Column({ allowNull: true })
  stockId!: number;

  @BelongsTo(() => Stock)
  stock!: Stock;
}
