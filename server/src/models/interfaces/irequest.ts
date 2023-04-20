import { Request } from "express";
import User from "../user";

export default interface IRequest extends Request {
  user?: User | null;
}
