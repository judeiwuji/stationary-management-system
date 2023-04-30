import { IStock } from './stock';

export interface IRequisition {
  id?: number;
  userId?: number;
  sourceId: number;
  through: number;
  destination: number;
  description: string;
  status: string;
  items: IRequisitionItem[];
}

export interface IRequisitionItem {
  id: number;
  requisitionId: number;
  price: number;
  quantity: number;
  stockId: number;
  stock?: IStock;
}
