import { number, object, string } from "yup";

export const ReceiptCreationSchema = object({
  requisitionItemId: number().required(),
});
