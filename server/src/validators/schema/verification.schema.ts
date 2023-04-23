import { mixed, number, object } from "yup";
import { RequisitionStatus } from "../../models/requisition-status";

export const VerificationCreationSchema = object({
  requisitionId: number().positive().integer().required(),
  recommedationId: number().positive().integer().required(),
  status: mixed()
    .oneOf([RequisitionStatus.CANCELED, RequisitionStatus.APPROVED])
    .required(),
});

export const VerificationUpdateSchema = object({
  id: number().positive().integer().required(),
  requisitionId: number().positive().integer().required(),
  recommedationId: number().positive().integer().required(),
  status: mixed()
    .oneOf([RequisitionStatus.CANCELED, RequisitionStatus.APPROVED])
    .optional(),
});
