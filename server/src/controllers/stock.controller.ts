import { Request, Response } from "express";
import validate from "../validators/validate";
import ReceiptService from "../services/receipt.service";
import { ReceiptCreationAttributes } from "../models/receipt";
import { ReceiptCreationSchema } from "../validators/schema/receipt.schema";
import IRequest from "../models/interfaces/irequest";
import User from "../models/user";
import StockService from "../services/stock.service";
import { StockAttributes, StockCreationAttributes } from "../models/stock";
import {
  StockCreationSchema,
  StockUpdateSchema,
} from "../validators/schema/stock.schema";

export default class StockController {
  stockService = new StockService();

  async createStock(req: IRequest, res: Response) {
    const validation = await validate<StockCreationAttributes>(
      StockCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }

    const feedback = await this.stockService.createStock(
      validation.data,
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.status(201).send(feedback);
  }

  async getStocks(req: Request, res: Response) {
    const search: any = req.query.search;
    const page = Number(req.query.page) || 1;

    const feedback = await this.stockService.getStocks(page, search);
    res.send(feedback);
  }

  async updateStock(req: Request, res: Response) {
    const validation = await validate<StockAttributes>(
      StockUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.stockService.updateStock(validation.data);
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.send(feedback);
  }

  async deleteStock(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      res.status(400).send("id is required");
    }
    const feedback = await this.stockService.deleteStock(Number(id));
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    res.send(feedback);
  }
}
