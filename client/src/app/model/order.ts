import {
  IRequisition,
  IRequisitionActionRequest,
  IRequisitionItem,
} from './requisition';
import { IStock } from './stock';
import { IUser } from './user';

export interface IOrder {
  id: number;
  status: OrderStatus;
  userId: number;
  requisitionId: number;
  user: IUser;
  requisition: IRequisition;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  isStockManager: boolean;
}

export interface IOrderActionRequest {
  id?: number;
  userId?: number;
  status?: OrderStatus;
  requisitionId?: number;
  requisitionItems?: IRequisitionActionRequest[];
}

export interface IOrderItem {
  id: number;
  stockId: number;
  orderId: number;
  quantity: number;
  subTotal: number;
  stock: IStock;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export interface IOrderItemActionRequest {
  id?: number;
  stockId?: number;
  orderId?: number;
  quantity?: number;
}
