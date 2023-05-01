import IRequest from "../models/interfaces/irequest";
import {
  RecommendationAttributes,
  RecommendationCreationAttributes,
} from "../models/recommendation";
import User from "../models/user";
import RecommendationService from "../services/recommendation.service";
import {
  RecommendationCreationSchema,
  RecommendationUpdateSchema,
} from "../validators/schema/recommedation.schema";
import validate from "../validators/validate";
import { Response, Request } from "express";

export default class RecommendationCongtroller {
  recommendationService = new RecommendationService();

  async createRecommendation(req: IRequest, res: Response) {
    const validation = await validate<RecommendationCreationAttributes>(
      RecommendationCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.recommendationService.createRecommendation(
      validation.data,
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.status(201).send(feedback);
  }

  async getRecommendations(req: IRequest, res: Response) {
    const filters: any = req.query.filters;
    const page = Number(req.query.page) || 1;

    const feedback = await this.recommendationService.getRecommendations(
      page,
      filters ? JSON.parse(filters) : "",
      req.user as User
    );
    res.send(feedback);
  }

  async updateRecommendation(req: Request, res: Response) {
    const validation = await validate<RecommendationAttributes>(
      RecommendationUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.recommendationService.updateRecommendation(
      validation.data
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.send(feedback);
  }

  async deleteRecommendation(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("id is required");
    }
    const feedback = await this.recommendationService.deleteRecommendation(
      Number(id)
    );
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    return res.send(feedback);
  }
}
