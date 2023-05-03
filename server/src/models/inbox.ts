import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import Message from "./message";
import { Optional } from "sequelize";
export interface InboxAttributes {
  id: number;
  userId: number;
  otherId: number;
  inboxId: number;
  messages: Message[];
}

export interface InboxCreationAttributes
  extends Optional<InboxAttributes, "id" | "messages" | "inboxId"> {}

@Table
export default class Inbox extends Model<
  InboxAttributes,
  InboxCreationAttributes
> {
  @Column
  @ForeignKey(() => User)
  userId!: number;

  @BelongsTo(() => User, { foreignKey: "userId" })
  user!: User;

  @Column
  @ForeignKey(() => User)
  otherId!: number;

  @BelongsTo(() => User, { foreignKey: "otherId" })
  other!: User;

  @Column
  @ForeignKey(() => Inbox)
  inboxId!: number;

  @BelongsTo(() => Inbox)
  inbox!: Inbox;

  @HasMany(() => Message, { sourceKey: "inboxId" })
  messages!: Message[];
}
