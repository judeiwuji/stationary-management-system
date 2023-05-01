import { IRecommendation } from './recommendation';
import { IRequisition, RequisitionStatus } from './requisition';
import { IUser } from './user';

export interface IAudit {
  id: number;
  status: RequisitionStatus;
  requisitionId: number;
  recommendationId: number;
  userId: number;
  requisition?: IRequisition;
  recommendation?: IRecommendation;
  user: IUser;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface IAuditActionRequest {
  id?: number;
  status?: RequisitionStatus;
  requisitionId?: number;
  recommendationId?: number;
  userId?: number;
}
