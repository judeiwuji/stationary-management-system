import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import UserController from "../controllers/user.controller";

export default class UserRoute implements IRoute {
  userController = new UserController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post("/api/users", (req, res) =>
      this.userController.createUser(req, res)
    );

    this.app.put("/api/users", (req, res) =>
      this.userController.updateUser(req, res)
    );

    this.app.get("/api/users", (req, res) =>
      this.userController.getUsers(req, res)
    );

    this.app.delete("/api/users/:id?", (req, res) =>
      this.userController.deleteUser(req, res)
    );
  }
}
