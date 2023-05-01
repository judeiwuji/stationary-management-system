import { IRecommendation } from './recommendation';
import { IRequisition, RequisitionStatus } from './requisition';
import { IUser } from './user';
import { IAudit } from './audit';

export interface IVerification {
  id: number;
  status: RequisitionStatus;
  auditId: number;
  requisitionId: number;
  recommendationId: number;
  userId: number;
  requisition?: IRequisition;
  recommendation?: IRecommendation;
  user: IUser;
  audit: IAudit;
  isOwner: boolean;
  isPurchaseOfficier: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface IVerificationActionRequest {
  id?: number;
  status?: RequisitionStatus;
  auditId?: number;
  requisitionId?: number;
  recommendationId?: number;
  userId?: number;
}
