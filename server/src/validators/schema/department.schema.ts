import { object, string } from "yup";

export const DepartmentCreationSchema = object({
  name: string().required(),
});

export const DepartmentUpdateSchema = object({
  name: string().required(),
  id: string().required(),
});
