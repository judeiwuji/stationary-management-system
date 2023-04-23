import { object, string } from "yup";

export const CommentCreationSchema = object({
  content: string().required(),
});

export const CommentUpdateSchema = object({
  content: string().optional(),
  id: string().required(),
});
