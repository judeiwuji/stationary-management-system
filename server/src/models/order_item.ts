import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from "sequelize-typescript";
import Order from "./order";
import Stock from "./stock";
import { Optional } from "sequelize";

export interface OrderItemAttributes {
  id: number;
  orderId: number;
  stockId: number;
  quantity: number;
  subTotal: number;
  order: Order;
  stock: Stock;
}

export interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, "id" | "order" | "stock"> {}

@Table
export default class OrderItem extends Model<
  OrderItemAttributes,
  OrderItemCreationAttributes
> {
  @ForeignKey(() => Order)
  @Column
  orderId!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @ForeignKey(() => Stock)
  @Column
  stockId!: number;

  @BelongsTo(() => Stock)
  stock!: Stock;

  @Column(DataType.INTEGER)
  quantity!: number;

  @Column(DataType.DECIMAL(8, 2))
  subTotal!: number;
}
