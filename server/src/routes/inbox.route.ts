import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import InboxController from "../controllers/inbox.controller";
import SessionManager from "../middlewares/session-manager";

export default class InboxRoute implements IRoute {
  inboxController = new InboxController();
  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/inbox",
      SessionManager.ensureAuthenticated,
      (req, res) => this.inboxController.createInbox(req, res)
    );

    this.app.get("/api/inbox", SessionManager.ensureAuthenticated, (req, res) =>
      this.inboxController.getAllInbox(req, res)
    );
  }
}
