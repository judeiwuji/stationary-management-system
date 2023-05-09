import { ICart } from './cart';

export interface IStock {
  id?: number;
  name: string;
  quantity: number;
  updatedAt?: string;
  cart?: ICart;
}

export interface IStockActionRequest {
  id?: number;
  name?: string;
  quantity?: number;
}
