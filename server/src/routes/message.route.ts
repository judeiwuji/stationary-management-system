import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import MessageController from "../controllers/message.controller";
import SessionManager from "../middlewares/session-manager";

export default class MessageRoute implements IRoute {
  messageController = new MessageController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/inbox/:id/messages",
      SessionManager.ensureAuthenticated,
      (req, res) => this.messageController.createMessage(req, res)
    );

    this.app.put(
      "/api/inbox/:id/messages",
      SessionManager.ensureAuthenticated,
      (req, res) => this.messageController.updateMessage(req, res)
    );

    this.app.get(
      "/api/inbox/:id/messages",
      SessionManager.ensureAuthenticated,
      (req, res) => this.messageController.getMessages(req, res)
    );
  }
}
