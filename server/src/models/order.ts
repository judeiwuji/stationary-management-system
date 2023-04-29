import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import Requisition from "./requisition";
import { Optional } from "sequelize";
import OrderItem from "./order_item";
import RequisitionItem from "./requisition_item";

export interface OrderAttributes {
  id: number;
  userId: number;
  requisitionId: number;
  user: User;
  requisition: Requisition;
  items: OrderItem[];
}

export interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "user" | "requisition" | "items"> {
  requisitionItems?: RequisitionItem[];
}

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

  @HasMany(() => OrderItem)
  items!: OrderItem[];
}
