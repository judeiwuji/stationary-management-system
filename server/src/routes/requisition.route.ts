import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import RequisitionController from "../controllers/requisition.controller";
import SessionManager from "../middlewares/session-manager";
import { Roles } from "../models/role";
import CommentController from "../controllers/comment.controller";

export default class RequisitionRoute implements IRoute {
  requisitionController = new RequisitionController();
  commentController = new CommentController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/requisitions",
      SessionManager.authorize([Roles.HOD, Roles.STOCK_MANAGER]),
      (req, res) => this.requisitionController.createRequisition(req, res)
    );

    this.app.get(
      "/api/requisitions",
      SessionManager.authorize([
        Roles.HOD,
        Roles.STOCK_MANAGER,
        Roles.BURSAR,
        Roles.AUDITOR,
        Roles.PURCHASE_OFFICIER,
        Roles.RECTOR,
      ]),
      (req, res) => this.requisitionController.getRequisitions(req, res)
    );

    this.app.get(
      "/api/requisitions/:id",
      SessionManager.authorize([
        Roles.HOD,
        Roles.STOCK_MANAGER,
        Roles.BURSAR,
        Roles.AUDITOR,
        Roles.PURCHASE_OFFICIER,
        Roles.RECTOR,
      ]),
      (req, res) => this.requisitionController.getRequisition(req, res)
    );

    this.app.put(
      "/api/requisitions",
      SessionManager.authorize([Roles.HOD, Roles.STOCK_MANAGER, Roles.BURSAR]),
      (req, res) => this.requisitionController.updateRequisition(req, res)
    );

    this.app.delete(
      "/api/requisitions/:id",
      SessionManager.authorize([Roles.HOD, Roles.STOCK_MANAGER]),
      (req, res) => this.requisitionController.deleteRequisition(req, res)
    );

    this.app.post(
      "/api/requisitions/items",
      SessionManager.authorize([Roles.HOD, Roles.STOCK_MANAGER, Roles.BURSAR]),
      (req, res) => this.requisitionController.addRequisitionItem(req, res)
    );

    this.app.delete(
      "/api/requisitions/items/:id",
      SessionManager.authorize([Roles.HOD, Roles.STOCK_MANAGER, Roles.BURSAR]),
      (req, res) => this.requisitionController.deleteRequisitionItem(req, res)
    );

    this.app.post(
      "/api/requisitions/:id/comments",
      SessionManager.ensureAuthenticated,
      (req, res) => this.commentController.createComment(req, res)
    );

    this.app.get(
      "/api/requisitions/:id/comments",
      SessionManager.ensureAuthenticated,
      (req, res) => this.commentController.getComments(req, res)
    );
  }
}
