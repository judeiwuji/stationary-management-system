import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import SessionManager from "../middlewares/session-manager";
import CommentController from "../controllers/comment.controller";

export default class CommentRoute implements IRoute {
  commentController = new CommentController();
  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    // this.app.post(
    //   "/api/comments",
    //   SessionManager.ensureAuthenticated,
    //   (req, res) => this.commentController.createComment(req, res)
    // );

    this.app.put(
      "/api/comments",
      SessionManager.ensureAuthenticated,
      (req, res) => this.commentController.updateComment(req, res)
    );

    // this.app.get("/api/comments", (req, res) =>
    //   this.commentController.getComments(req, res)
    // );

    this.app.delete(
      "/api/comments/:id",
      SessionManager.ensureAuthenticated,
      (req, res) => this.commentController.deleteComment(req, res)
    );
  }
}
