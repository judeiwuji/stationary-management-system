import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import DashboardController from "../controllers/dashboard.controller";
import SessionManager from "../middlewares/session-manager";

export default class DashboardRoute implements IRoute {
  dashboardController = new DashboardController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.get(
      "/api/dashboard/analytics",
      SessionManager.ensureAuthenticated,
      (req, res) => this.dashboardController.getAnalytics(req, res)
    );
  }
}
