import { Optional } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

export interface StockAttributes {
  id: number;
  name: string;
  quantity: number;
}

export interface StockCreationAttributes
  extends Optional<StockAttributes, "id"> {}

@Table
export default class Stock extends Model<
  StockAttributes,
  StockCreationAttributes
> {
  @Column({ type: DataType.STRING(100), unique: true })
  name!: string;

  @Column(DataType.INTEGER)
  quantity!: number;
}
