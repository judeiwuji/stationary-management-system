import { Request, Response } from "express";
import validate from "../validators/validate";
import OrderService from "../services/order.service";
import { OrderAttributes, OrderCreationAttributes } from "../models/order";
import {
  OrderCreationSchema,
  OrderUpdateSchema,
} from "../validators/schema/order.schema";
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

  async updateOrder(req: IRequest, res: Response) {
    const validation = await validate<OrderAttributes>(
      OrderUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.orderService.updateOrder(validation.data);

    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.send(feedback);
  }

  async getOrders(req: IRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    const filters: any = req.query.filters;

    const feedback = await this.orderService.getOrders(
      page,
      filters ? JSON.parse(filters) : {},
      req.user as User
    );
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
