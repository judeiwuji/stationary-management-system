import { RequisitionStatus } from './requisition';

export interface IAudit {
  id: number;
  status: RequisitionStatus;
  requisitionId: number;
  recommendationId: number;
  userId: number;
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
