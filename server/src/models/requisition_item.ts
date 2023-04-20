import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Requisition from "./requisition";
import { DataTypes, Optional } from "sequelize";

interface RequistionItemAttributes {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface RequistionItemCreationAttributes
  extends Optional<RequistionItem, "id"> {}

@Table
export default class RequistionItem extends Model<
  RequistionItemAttributes,
  RequistionItemCreationAttributes
> {
  @ForeignKey(() => Requisition)
  @Column
  requisitionId!: number;
  @BelongsTo(() => Requisition)
  requisition!: Requisition;

  @Column({
    allowNull: false,
    type: DataTypes.STRING(250),
  })
  name!: string;

  @Column({ allowNull: false, type: DataTypes.DECIMAL(10, 2) })
  price!: number;

  @Column({ allowNull: false, type: DataTypes.INTEGER })
  quantity!: number;
}
