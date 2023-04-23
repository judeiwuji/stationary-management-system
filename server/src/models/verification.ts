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
import Audit from "./audit";
import { Optional } from "sequelize";

export interface VerificationAttributes {
  id: number;
  status: string;
  requisitionId: number;
  auditId: number;
  recommendationId: number;
  userId: number;
  audit: Audit;
  requisition: Requisition;
  recommendation: Recommendation;
  user: User;
}

export interface VerificationCreationAttributes
  extends Optional<
    VerificationAttributes,
    "id" | "user" | "requisition" | "recommendation" | "audit"
  > {}

@Table
export default class Verification extends Model<
  VerificationAttributes,
  VerificationCreationAttributes
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

  @ForeignKey(() => Audit)
  @Column
  auditId!: number;

  @BelongsTo(() => Audit)
  audit!: Audit;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
