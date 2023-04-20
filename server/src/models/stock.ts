import { Optional } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface StockAttributes {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface StockCreationAttributes extends Optional<StockAttributes, "id"> {}

@Table
export default class Stock extends Model<
  StockAttributes,
  StockCreationAttributes
> {
  @Column(DataType.STRING(100))
  name!: string;

  @Column(DataType.DECIMAL(10, 2))
  price!: number;

  @Column(DataType.INTEGER)
  quantity!: number;
}
