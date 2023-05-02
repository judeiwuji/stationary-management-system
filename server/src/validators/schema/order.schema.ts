import { array, number, object, string } from "yup";

export const RequisitionItemOrderSchema = object({
  price: number().positive().required(),
  quantity: number().positive().integer().required(),
  stockId: number().positive().integer().required(),
});

export const OrderCreationSchema = object({
  requisitionId: number().positive().integer().required(),
  requisitionItems: array().of(RequisitionItemOrderSchema).required(),
});

export const OrderUpdateSchema = object({
  id: number().positive().integer().required(),
  status: string().optional(),
});
