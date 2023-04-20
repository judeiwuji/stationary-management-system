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

export interface RecommendationAttributes {
  id: number;
  status: string;
  requisitionId: number;
  userId: number;
  requisition: Requisition;
  user: User;
}

export interface RecommendationCreationAttributes
  extends Optional<RecommendationAttributes, "id" | "user" | "requisition"> {}

@Table
export default class Recommendation extends Model<
  RecommendationAttributes,
  RecommendationCreationAttributes
> {
  @Column({ type: DataType.STRING(20), allowNull: false })
  status!: string;

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
