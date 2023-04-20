import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import Requisition from "./requisition";
import { Optional } from "sequelize";

interface OrderAttributes {
  id: number;
  userId: number;
  requisitionId: number;
  user: User;
  requisition: Requisition;
}

interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "user" | "requisition"> {}

@Table
export default class Order extends Model<
  OrderAttributes,
  OrderCreationAttributes
> {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @ForeignKey(() => Requisition)
  @Column
  requisitionId!: number;

  @BelongsTo(() => Requisition)
  requisition?: Requisition;
}
