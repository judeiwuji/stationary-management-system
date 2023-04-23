import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import SessionManager from "../middlewares/session-manager";
import { Roles } from "../models/role";
import VerificationController from "../controllers/verification.controller";

export default class VerificationRoute implements IRoute {
  verifyController = new VerificationController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/verifications/",
      SessionManager.authorize([Roles.RECTOR]),
      (req, res) => this.verifyController.createVerification(req, res)
    );
    this.app.get(
      "/api/verifications/",
      SessionManager.authorize([Roles.RECTOR]),
      (req, res) => this.verifyController.getVerifications(req, res)
    );
    this.app.put(
      "/api/verifications/",
      SessionManager.authorize([Roles.RECTOR]),
      (req, res) => this.verifyController.updateVerification(req, res)
    );
    this.app.delete(
      "/api/verifications/:id",
      SessionManager.authorize([Roles.RECTOR]),
      (req, res) => this.verifyController.deleteVerification(req, res)
    );
  }
}
