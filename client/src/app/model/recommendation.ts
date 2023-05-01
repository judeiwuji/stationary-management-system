import { IRequisition, RequisitionStatus } from './requisition';
import { IUser } from './user';

export interface IRecommendation {
  id: number;
  status: RequisitionStatus;
  requisitionId: number;
  requisition: IRequisition;
  userId: number;
  user: IUser;
  isAuditor: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRecommendationActionRequest {
  id?: number;
  status?: RequisitionStatus;
  requisitionId?: number;
  userId?: number;
}
