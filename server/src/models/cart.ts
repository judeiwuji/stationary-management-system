import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Stock from "./stock";
import User from "./user";
import { Optional } from "sequelize";

export interface CartAttributes {
  id: number;
  stockId: number;
  userId: number;
  quantity: number;
  stock: Stock;
  user: User;
}

export interface CartCreationAttributes
  extends Optional<CartAttributes, "id" | "stock" | "user"> {}

@Table
export default class Cart extends Model<
  CartAttributes,
  CartCreationAttributes
> {
  @ForeignKey(() => Stock)
  @Column
  stockId!: number;

  @BelongsTo(() => Stock)
  stock!: Stock;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.INTEGER)
  quantity!: number;
}
