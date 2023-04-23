import { mixed, number, object } from "yup";
import { RequisitionStatus } from "../../models/requisition-status";

export const RecommendationCreationSchema = object({
  requisitionId: number().positive().integer().required(),
});

export const RecommendationUpdateSchema = object({
  id: number().positive().integer().required(),
  status: mixed()
    .oneOf([
      RequisitionStatus.PENDING,
      RequisitionStatus.CANCELED,
      RequisitionStatus.VERIFIED,
    ])
    .optional(),
});
