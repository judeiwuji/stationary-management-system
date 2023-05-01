import { AuditAttributes, AuditCreationAttributes } from "../models/audit";
import IRequest from "../models/interfaces/irequest";
import User from "../models/user";
import AuditService from "../services/audit.service";
import {
  AuditCreationSchema,
  AuditUpdateSchema,
} from "../validators/schema/audit.schema";
import validate from "../validators/validate";
import { Response, Request } from "express";

export default class AuditController {
  auditService = new AuditService();

  async createAudit(req: IRequest, res: Response) {
    const validation = await validate<AuditCreationAttributes>(
      AuditCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.auditService.createAudit(
      validation.data,
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.status(201).send(feedback);
  }

  async getAudits(req: IRequest, res: Response) {
    const filters: any = req.query.filters;
    const page = Number(req.query.page) || 1;

    const feedback = await this.auditService.getAudits(
      page,
      filters ? JSON.parse(filters) : "",
      req.user as User
    );
    res.send(feedback);
  }

  async updateAudit(req: Request, res: Response) {
    const validation = await validate<AuditAttributes>(
      AuditUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.auditService.updateAudit(validation.data);
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.send(feedback);
  }

  async deleteAudit(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("id is required");
    }
    const feedback = await this.auditService.deleteAudit(Number(id));
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    return res.send(feedback);
  }
}
