import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import RecommendationController from "../controllers/recommendation.controller";
import SessionManager from "../middlewares/session-manager";
import { Roles } from "../models/role";

export default class RecommendationRoute implements IRoute {
  recommdendationController = new RecommendationController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/recommendations/",
      SessionManager.authorize([Roles.BURSAR]),
      (req, res) =>
        this.recommdendationController.createRecommendation(req, res)
    );
    this.app.get(
      "/api/recommendations/",
      SessionManager.authorize([Roles.BURSAR, Roles.AUDITOR]),
      (req, res) => this.recommdendationController.getRecommendations(req, res)
    );
    this.app.put(
      "/api/recommendations/",
      SessionManager.authorize([Roles.BURSAR, Roles.AUDITOR]),
      (req, res) =>
        this.recommdendationController.updateRecommendation(req, res)
    );
    this.app.delete(
      "/api/recommendations/:id",
      SessionManager.authorize([Roles.BURSAR]),
      (req, res) =>
        this.recommdendationController.deleteRecommendation(req, res)
    );
  }
}
