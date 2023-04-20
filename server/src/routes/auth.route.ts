import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import AuthController from "../controllers/auth.controller";

export default class AuthRoute implements IRoute {
  authController = new AuthController();
  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post("/api/login", (req, res) =>
      this.authController.login(req, res)
    );

    this.app.post("/api/logout", (req, res) =>
      this.authController.logout(req, res)
    );
  }
}
