import { AuditAttributes, AuditCreationAttributes } from "../models/audit";
import IRequest from "../models/interfaces/irequest";
import User from "../models/user";
import {
  VerificationAttributes,
  VerificationCreationAttributes,
} from "../models/verification";
import VerificationService from "../services/verification.service";
import {
  AuditCreationSchema,
  AuditUpdateSchema,
} from "../validators/schema/audit.schema";
import {
  VerificationCreationSchema,
  VerificationUpdateSchema,
} from "../validators/schema/verification.schema";
import validate from "../validators/validate";
import { Response, Request } from "express";

export default class VerificationController {
  verifyService = new VerificationService();

  async createVerification(req: IRequest, res: Response) {
    const validation = await validate<VerificationCreationAttributes>(
      VerificationCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.verifyService.createVerification(
      validation.data,
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.status(201).send(feedback);
  }

  async getVerifications(req: IRequest, res: Response) {
    const filters: any = req.query.filters;
    const page = Number(req.query.page) || 1;

    const feedback = await this.verifyService.getVerifications(
      page,
      filters ? JSON.parse(filters) : "",
      req.user as User
    );
    res.send(feedback);
  }

  async updateVerification(req: Request, res: Response) {
    const validation = await validate<VerificationAttributes>(
      VerificationUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.verifyService.updateVerification(
      validation.data
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.send(feedback);
  }

  async deleteVerification(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("id is required");
    }
    const feedback = await this.verifyService.deleteVerification(Number(id));
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    return res.send(feedback);
  }
}
