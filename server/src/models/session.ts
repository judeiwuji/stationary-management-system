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

interface SessionAttributes {
  id: number;
  userId: number;
  refreshToken: string;
  userAgent: string;
  valid: boolean;
  user: User;
}

interface SessionCreationAttributes
  extends Optional<SessionAttributes, "id" | "user"> {}

@Table
export default class Session extends Model<
  SessionAttributes,
  SessionCreationAttributes
> {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.TEXT({ length: "medium" }))
  refreshToken!: string;

  @Column(DataType.STRING(300))
  userAgent!: number;

  @Column(DataType.BOOLEAN)
  valid!: boolean;
}
