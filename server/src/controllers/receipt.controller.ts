import { Request, Response } from "express";
import validate from "../validators/validate";
import ReceiptService from "../services/receipt.service";
import { ReceiptCreationAttributes } from "../models/receipt";
import { ReceiptCreationSchema } from "../validators/schema/receipt.schema";
import IRequest from "../models/interfaces/irequest";
import User from "../models/user";

export default class ReceiptController {
  receiptService = new ReceiptService();

  async createReceipt(req: IRequest, res: Response) {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).send("receipt is required");
    }
    const validation = await validate<ReceiptCreationAttributes>(
      ReceiptCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }

    validation.data.image = req.file.path;
    const feedback = await this.receiptService.createReceipt(
      validation.data,
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.status(201).send(feedback);
  }

  async getReceipts(req: IRequest, res: Response) {
    const search: any = req.query.search;
    const page = Number(req.query.page) || 1;

    const feedback = await this.receiptService.getReceipts(
      page,
      search,
      req.user as User
    );
    res.send(feedback);
  }

  async deleteReceipt(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      res.status(400).send("id is required");
    }
    const feedback = await this.receiptService.deleteReceipt(Number(id));
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    res.send(feedback);
  }
}
