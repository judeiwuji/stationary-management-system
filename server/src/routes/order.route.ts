import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import SessionManager from "../middlewares/session-manager";
import { Roles } from "../models/role";
import OrderController from "../controllers/order.controller";

export default class OrderRoute implements IRoute {
  orderController = new OrderController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/orders/requisitions",
      SessionManager.authorize([Roles.ADMIN, Roles.STOCK_MANAGER, Roles.HOD]),
      (req, res) => this.orderController.createRequisitionOrder(req, res)
    );

    this.app.post(
      "/api/orders",
      SessionManager.authorize([Roles.ADMIN, Roles.STOCK_MANAGER, Roles.HOD]),
      (req, res) => this.orderController.createOrder(req, res)
    );

    this.app.get(
      "/api/orders",
      SessionManager.authorize([Roles.ADMIN, Roles.STOCK_MANAGER, Roles.HOD]),
      (req, res) => this.orderController.getOrders(req, res)
    );

    this.app.get(
      "/api/orders/report",
      SessionManager.authorize([Roles.ADMIN, Roles.STOCK_MANAGER, Roles.HOD]),
      (req, res) => this.orderController.getOrdersReport(req, res)
    );

    this.app.put(
      "/api/orders",
      SessionManager.authorize([Roles.ADMIN, Roles.STOCK_MANAGER, Roles.HOD]),
      (req, res) => this.orderController.updateOrder(req, res)
    );

    this.app.delete(
      "/api/orders/:id",
      SessionManager.authorize([Roles.ADMIN, Roles.STOCK_MANAGER, Roles.HOD]),
      (req, res) => this.orderController.deleteOrder(req, res)
    );
  }
}
