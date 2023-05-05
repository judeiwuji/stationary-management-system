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

    this.app.get(
      "/api/inbox/hasNewMessages",
      SessionManager.ensureAuthenticated,
      (req, res) => this.inboxController.hasNewInboxMessages(req, res)
    );

    this.app.get(
      "/api/inbox/:id",
      SessionManager.ensureAuthenticated,
      (req, res) => this.inboxController.getInbox(req, res)
    );
  }
}
