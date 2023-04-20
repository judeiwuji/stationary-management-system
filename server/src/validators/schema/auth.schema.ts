import { object, string } from "yup";

export const AuthSchema = object({
  email: string().email().required(),
  password: string().required(),
});
