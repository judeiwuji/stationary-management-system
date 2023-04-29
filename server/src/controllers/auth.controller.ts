import { Request, Response } from "express";
import { AuthRequest } from "../models/auth";
import AuthService from "../services/auth.service";
import validate from "../validators/validate";
import { AuthSchema } from "../validators/schema/auth.schema";

export default class AuthController {
  authService = new AuthService();

  async login(req: Request, res: Response) {
    const validation = await validate<AuthRequest>(AuthSchema, req.body);
    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const request = validation.data;
    request.userAgent = req.headers["user-agent"] as string;

    const feedback = await this.authService.authenticate(request);
    if (!feedback.success) {
      res.statusMessage = feedback.message;
      return res.status(400).send(feedback.message);
    }
    res.setHeader("x-access", feedback.data.token);
    res.send(feedback);
  }

  async logout(req: Request, res: Response) {
    const authorization = req.headers.authorization;

    if (authorization) {
      const token = authorization.split(" ")[1];
      await this.authService.logout(token);
    }
    res.send(true);
  }
}
