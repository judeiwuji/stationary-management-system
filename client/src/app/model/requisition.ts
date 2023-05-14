import { IComment } from './comment';
import { IDepartment } from './department';
import { IReceipt } from './purchase';
import { IStock } from './stock';
import { IUser } from './user';

export interface IRequisition {
  id?: number;
  userId?: number;
  sourceId: number;
  through: number;
  destination: number;
  description: string;
  status?: string;
  items: IRequisitionItem[];
  department?: IDepartment;
  comments?: IComment[];
  isOwner?: boolean;
  isBursar?: boolean;
  isAuditor?: boolean;
  isRector?: boolean;
  isPurchaseOfficier?: boolean;
  isStockManager?: boolean;
  user?: IUser;
  createdAt?: string;
}

export interface IRequisitionItem {
  id?: number;
  requisitionId?: number;
  price: number;
  quantity: number;
  stockId: number;
  stock?: IStock;
  receipt?: IReceipt;
}

export enum RequisitionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  RECOMMENDED = 'recommended',
  VERIFIED = 'verified',
  APPROVED = 'approved',
  CANCELED = 'canceled',
  PURCHASED = 'purchased',
  ORDERED = 'ordered',
}

export interface IRequisitionActionRequest {
  id?: number;
  sourceId?: number;
  through?: number;
  destination?: number;
  description?: string;
  status?: string;
  items?: IRequisitionItem[];
}

export interface IRequisitionActionRequest {
  id?: number;
  requisitionId?: number;
  price?: number;
  quantity?: number;
  stockId?: number;
}
