import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from "sequelize-typescript";
import Stock from "./stock";
import { Optional } from "sequelize";
import RequistionItem from "./requisition_item";

interface PurchaseAttributes {
  id: number;
  stockId: number;
  receipt: string;
  price: number;
  quantity: number;
  stock: Stock;
}

interface PurchaseCreationAttributes
  extends Optional<PurchaseAttributes, "id" | "stock"> {}

@Table
export default class Purchase extends Model<
  PurchaseAttributes,
  PurchaseCreationAttributes
> {
  @ForeignKey(() => RequistionItem)
  @Column
  requisitionItemId!: number;

  @BelongsTo(() => RequistionItem)
  requisitionItem!: RequistionItem;

  @Column({
    type: DataType.STRING(300),
    allowNull: false,
  })
  receipt!: string;

  @Column(DataType.DECIMAL(10, 2))
  price!: string;

  @Column(DataType.INTEGER)
  quantity!: string;
}
