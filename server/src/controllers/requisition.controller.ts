import { Request, Response } from "express";
import validate from "../validators/validate";
import {
  RequisitionCreationSchema,
  RequisitionItemCreationSchema,
  RequisitionUpdateSchema,
} from "../validators/schema/requisition.schema";
import RequisitionService from "../services/requisition.service";
import {
  RequisitionAttributes,
  RequisitionCreationAttributes,
} from "../models/requisition";
import IRequest from "../models/interfaces/irequest";
import User from "../models/user";
import { RequisitionItemCreationAttributes } from "../models/requisition_item";

export default class RequisitionController {
  requisitionService = new RequisitionService();

  async createRequisition(req: IRequest, res: Response) {
    const validation = await validate<RequisitionCreationAttributes>(
      RequisitionCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.requisitionService.createRequisition(
      validation.data,
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.status(201).send(feedback);
  }

  async getRequisitions(req: IRequest, res: Response) {
    const filters: any = req.query.filters;
    const page = Number(req.query.page) || 1;

    const feedback = await this.requisitionService.getRequisitions(
      page,
      filters ? JSON.parse(filters) : "",
      req.user as User
    );
    res.send(feedback);
  }

  async updateRequisition(req: Request, res: Response) {
    const validation = await validate<RequisitionAttributes>(
      RequisitionUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.requisitionService.updateRequisition(
      validation.data
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.send(feedback);
  }

  async deleteRequisition(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("id is required");
    }
    const feedback = await this.requisitionService.deleteRequisition(
      Number(id)
    );
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    return res.send(feedback);
  }

  async addRequisitionItem(req: Request, res: Response) {
    const validation = await validate<RequisitionItemCreationAttributes>(
      RequisitionItemCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.requisitionService.addRequisitionItem(
      validation.data
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.status(201).send(feedback);
  }

  async deleteRequisitionItem(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("id is required");
    }
    const feedback = await this.requisitionService.deleteRequisitionItem(
      Number(id)
    );
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    return res.send(feedback);
  }
}
