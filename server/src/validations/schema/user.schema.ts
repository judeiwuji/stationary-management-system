import { object, string, number, mixed } from "yup";
import { Roles } from "../../models/role";

const UserSchema = object({
  firstname: string().required(),
  lastname: string().required(),
  email: string().email("must be a valid email").required(),
  password: string().min(6, "must be at least 6 characters").required(),
  role: mixed().oneOf(Object.values(Roles)).defined(),
});

export default UserSchema;
