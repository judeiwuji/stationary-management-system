import { IRequisition, IRequisitionItem } from './requisition';
import { IUser } from './user';

export interface IReceipt {
  id: number;
  requisitionItemId: number;
  userId: number;
  image: string;
  user: IUser;
  item: IRequisitionItem;
  createdAt: string;
  updatedAt: string;
}

export interface IReceiptActionRequest {
  id?: number;
  requisitionItemId?: number;
  userId?: number;
  image?: string;
}
