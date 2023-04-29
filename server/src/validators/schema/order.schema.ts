import { array, number, object, string } from "yup";
import { RequisitionItemCreationSchema } from "./requisition.schema";

export const RequisitionItemOrderSchema = object({
  name: string().required(),
  price: number().positive().required(),
  quantity: number().positive().integer().required(),
  stockId: number().positive().integer().required(),
});

export const OrderCreationSchema = object({
  requisitionId: number().positive().integer().required(),
  requisitionItems: array().of(RequisitionItemOrderSchema).required(),
});
