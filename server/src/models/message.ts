import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import { Optional } from "sequelize";
import Inbox from "./inbox";

export interface MessageAttributes {
  id: number;
  inboxId: number;
  userId: number;
  content: string;
  status: number;
  user?: User;
}

export interface MessageCreationAttributes
  extends Optional<MessageAttributes, "id" | "user"> {}

@Table
export default class Message extends Model<
  MessageAttributes,
  MessageCreationAttributes
> {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Inbox)
  @Column
  inboxId!: number;

  @Column(DataType.STRING(300))
  content!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  status!: number;
}
