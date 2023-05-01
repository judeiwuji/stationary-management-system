import { IRequisition } from './requisition';
import { IUser } from './user';

export interface IComment {
  id: number;
  content: string;
  requisitionId: number;
  userId: number;
  user: IUser;
  requisition?: IRequisition;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICommentActionRequest {
  id?: number;
  content?: string;
  requisitionId?: number;
  userId?: number;
}
