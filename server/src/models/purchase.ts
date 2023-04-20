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
  @ForeignKey(() => Stock)
  @Column
  stockId!: number;

  @BelongsTo(() => Stock)
  stock!: Stock;

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
