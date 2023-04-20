import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import UserController from "../controllers/user.controller";

export default class UserRoute implements IRoute {
  userController = new UserController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post("/api/users", this.userController.createUser);
  }
}
