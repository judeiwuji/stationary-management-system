import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Requisition from "./requisition";
import User from "./user";
import { Optional } from "sequelize";

export interface CommentAttributes {
  id: number;
  content: string;
  userId: number;
  requisitionId: number;
  user?: User;
  requisition?: Requisition;
}

export interface CommentCreationAttributes
  extends Optional<CommentAttributes, "id" | "userId" | "requisitionId"> {}

@Table
export default class Comment extends Model<
  CommentAttributes,
  CommentCreationAttributes
> {
  @Column({
    type: DataType.STRING(300),
    allowNull: false,
  })
  content!: string;

  @ForeignKey(() => Requisition)
  @Column
  requisitionId!: number;

  @BelongsTo(() => Requisition)
  requisition!: Requisition;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
