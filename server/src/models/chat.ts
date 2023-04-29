import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import { Optional } from "sequelize";

export interface ChatAttributes {
  id: number;
  userId: number;
  otherId: number;
  content: string;
  user?: User;
  other?: User;
}

export interface ChatCreationAttributes
  extends Optional<ChatAttributes, "id" | "user" | "other"> {}

@Table
export default class Chat extends Model<
  ChatAttributes,
  ChatCreationAttributes
> {
  @ForeignKey(() => User)
  @Column
  userId!: number;
  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => User)
  @Column
  otherId!: number;
  @BelongsTo(() => User)
  other!: User;

  @Column
  content!: string;
}
