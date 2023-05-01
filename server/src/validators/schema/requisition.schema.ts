import { array, mixed, number, object, string } from "yup";
import { RequisitionStatus } from "../../models/requisition-status";
import { Roles } from "../../models/role";

export const RequisitionItemCreationSchema = object({
  price: number().positive().required(),
  quantity: number().positive().integer().required(),
  requisitionId: number().positive().integer().optional(),
  stockId: number().positive().integer().required(),
});

export const RequisitionItemUpdateSchema = object({
  price: number().optional(),
  quantity: number().positive().integer().optional(),
  requisitionId: number().positive().integer().optional(),
  stockId: number().positive().integer().optional(),
});

export const RequisitionCreationSchema = object({
  sourceId: number().positive().integer().required(),
  through: mixed().oneOf([Roles.BURSAR]).required(),
  destination: mixed().oneOf([Roles.RECTOR]).required(),
  description: string().required(),
  items: array().of(RequisitionItemCreationSchema).min(1),
});

export const RequisitionUpdateSchema = object({
  id: string().required(),
  sourceId: number().positive().integer().optional(),
  through: number().positive().integer().optional(),
  destination: number().positive().integer().optional(),
  description: string().optional(),
  status: mixed().oneOf(Object.values(RequisitionStatus)).optional(),
});
