import { IStock } from './stock';
import { IUser } from './user';

export interface ICart {
  id: number;
  stockId: number;
  quantity: number;
  userId: number;
  user: IUser;
  stock: IStock;
}

export interface ICartActionRequest {
  id?: number;
  stockId?: number;
  quantity?: number;
}
