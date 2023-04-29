import { Request, Response } from "express";
import validate from "../validators/validate";
import OrderService from "../services/order.service";
import { OrderCreationAttributes } from "../models/order";
import { OrderCreationSchema } from "../validators/schema/order.schema";
import IRequest from "../models/interfaces/irequest";
import User from "../models/user";

export default class OrderController {
  orderService = new OrderService();

  async createOrder(req: IRequest, res: Response) {
    const validation = await validate<OrderCreationAttributes>(
      OrderCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }

    const feedback = await this.orderService.createOrder(
      validation.data,
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.status(201).send(feedback);
  }

  async getOrders(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;

    const feedback = await this.orderService.getOrders(page);
    res.send(feedback);
  }

  async deleteOrder(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      res.status(400).send("id is required");
    }
    const feedback = await this.orderService.deleteOrder(Number(id));
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    res.send(feedback);
  }
}
