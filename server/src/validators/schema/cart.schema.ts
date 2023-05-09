import { number, object } from "yup";

export const CartCreationSchema = object({
  stockId: number().positive().integer().required(),
  quantity: number().positive().integer().required(),
});

export const CartUpdateSchema = object({
  id: number().positive().integer().required(),
  quantity: number().positive().integer().optional(),
});
