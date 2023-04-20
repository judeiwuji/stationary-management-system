import { object, string, mixed, number } from "yup";
import { Roles } from "../../models/role";

export const UserCreationSchema = object({
  firstname: string().required(),
  lastname: string().required(),
  email: string().email("must be a valid email").required(),
  password: string()
    .required()
    .matches(/^[A-Za-z0-9@#$%^&*()!_+=]{6,}$/),
  role: mixed().oneOf(Object.values(Roles)).defined(),
});

export const UserUpdateSchema = object({
  id: number().positive().integer().required(),
  firstname: string().optional(),
  lastname: string().optional(),
  email: string().email("must be a valid email").optional(),
  role: mixed().oneOf(Object.values(Roles)).optional(),
});
