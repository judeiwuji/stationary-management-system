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
import Recommendation from "./recommendation";
import { Optional } from "sequelize";

export interface AuditAttributes {
  id: number;
  status: string;
  requisitionId: number;
  recommendationId: number;
  userId: number;
  requisition: Requisition;
  recommendation: Recommendation;
  user: User;
}

export interface AuditCreationAttributes
  extends Optional<
    AuditAttributes,
    "id" | "user" | "requisition" | "recommendation"
  > {}

@Table
export default class Audit extends Model<
  AuditAttributes,
  AuditCreationAttributes
> {
  @Column({ type: DataType.STRING(20), allowNull: false })
  status!: string;

  @ForeignKey(() => Requisition)
  @Column
  requisitionId!: number;

  @BelongsTo(() => Requisition)
  requisition!: Requisition;

  @ForeignKey(() => Recommendation)
  @Column
  recommendationId!: number;

  @BelongsTo(() => Recommendation)
  recommendation!: Recommendation;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
