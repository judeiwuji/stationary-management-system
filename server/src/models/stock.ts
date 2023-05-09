import { Optional } from "sequelize";
import { Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import Cart from "./cart";

export interface StockAttributes {
  id: number;
  name: string;
  quantity: number;
  cart: Cart;
}

export interface StockCreationAttributes
  extends Optional<StockAttributes, "id" | "cart"> {}

@Table
export default class Stock extends Model<
  StockAttributes,
  StockCreationAttributes
> {
  @Column({ type: DataType.STRING(100), unique: true })
  name!: string;

  @Column(DataType.INTEGER)
  quantity!: number;

  @HasOne(() => Cart)
  cart!: Cart;
}
