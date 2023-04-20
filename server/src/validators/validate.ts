import { AnySchema, InferType, ValidationError } from "yup";
import Feedback from "../models/feedback";

export default async function validate<T>(schema: AnySchema, data: any) {
  let feedback = new Feedback<T>();
  try {
    feedback.data = await schema.validate(data);
  } catch (error: any) {
    feedback.success = false;
    feedback.message = `${error.message}`;
  }
  return feedback;
}
