import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import SessionManager from "../middlewares/session-manager";
import { Roles } from "../models/role";
import VerificationController from "../controllers/verification.controller";
import StockController from "../controllers/stock.controller";

export default class StockRoute implements IRoute {
  stockController = new StockController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/stocks/",
      SessionManager.authorize([Roles.STOCK_MANAGER]),
      (req, res) => this.stockController.createStock(req, res)
    );
    this.app.get(
      "/api/stocks/",
      SessionManager.authorize([Roles.STOCK_MANAGER]),
      (req, res) => this.stockController.getStocks(req, res)
    );
    this.app.put(
      "/api/stocks/",
      SessionManager.authorize([Roles.STOCK_MANAGER]),
      (req, res) => this.stockController.updateStock(req, res)
    );
    this.app.delete(
      "/api/stocks/:id",
      SessionManager.authorize([Roles.STOCK_MANAGER]),
      (req, res) => this.stockController.deleteStock(req, res)
    );
  }
}
