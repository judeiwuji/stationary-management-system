import { number, object, string } from "yup";

export const StockCreationSchema = object({
  name: string().required(),
});

export const StockUpdateSchema = object({
  id: number().positive().integer().required(),
  name: string().optional(),
});
