import { Request, Response } from "express";
import UserSchema from "../validations/schema/user.schema";

export default class UserController {
  async createUser(req: Request, res: Response) {
    const data = await UserSchema.validate(req.body);
    console.log(data);
  }
}
