import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import SessionManager from "../middlewares/session-manager";
import { Roles } from "../models/role";
import AuditController from "../controllers/audit.controller";

export default class AuditRoute implements IRoute {
  auditController = new AuditController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/audits/",
      SessionManager.authorize([Roles.AUDITOR]),
      (req, res) => this.auditController.createAudit(req, res)
    );
    this.app.get(
      "/api/audits/",
      SessionManager.authorize([Roles.AUDITOR, Roles.RECTOR]),
      (req, res) => this.auditController.getAudits(req, res)
    );
    this.app.put(
      "/api/audits/",
      SessionManager.authorize([Roles.AUDITOR, Roles.RECTOR]),
      (req, res) => this.auditController.updateAudit(req, res)
    );
    this.app.delete(
      "/api/audits/:id",
      SessionManager.authorize([Roles.AUDITOR]),
      (req, res) => this.auditController.deleteAudit(req, res)
    );
  }
}
