import { Request, Response } from "express";
import DashboardService from "../services/dashboard.service";

export default class DashboardController {
  dashboardService = new DashboardService();

  async getAnalytics(req: Request, res: Response) {
    const feedback = await this.dashboardService.getAnalytics();
    res.send(feedback);
  }
}
