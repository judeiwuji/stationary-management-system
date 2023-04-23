import { mixed, number, object } from "yup";
import { RequisitionStatus } from "../../models/requisition-status";

export const AuditCreationSchema = object({
  recommendationId: number().positive().integer().required(),
  status: mixed()
    .oneOf([RequisitionStatus.CANCELED, RequisitionStatus.VERIFIED])
    .required(),
});

export const AuditUpdateSchema = object({
  id: number().positive().integer().required(),
  status: mixed()
    .oneOf([RequisitionStatus.CANCELED, RequisitionStatus.VERIFIED])
    .required(),
});
