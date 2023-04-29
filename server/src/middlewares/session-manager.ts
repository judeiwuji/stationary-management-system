import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import AuthService from "../services/auth.service";
import UserDTO from "../models/DTO/UserDTO";
import IRequest from "../models/interfaces/irequest";
import { Roles } from "../models/role";

export default class SessionManager {
  static async deserializeUser(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    const authorization: any =
      req.headers.authorization || req.query.authorization;

    if (authorization) {
      const authService = new AuthService();
      const token = authorization.split(" ")[1];
      const verified = authService.verifyToken(token);

      console.log(verified);
      if (!verified.expired && verified.data.user) {
        req.user = await User.findByPk(verified.data.user, {
          attributes: UserDTO,
        });
      }
    }
    next();
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    const authorization: any =
      req.headers.authorization || req.query.authorization;

    if (authorization) {
      const authService = new AuthService();
      const token = authorization.split(" ")[1];
      const verified = authService.verifyToken(token);

      if (await authService.isValidSession(verified.data.session)) {
        if (verified.expired) {
          const feedback = await authService.refreshToken(verified.data);
          if (!feedback.success) {
            return res.status(401).send(feedback.message);
          }
          console.log(`Refreshed: ${feedback.data}`);
          req.headers["authorization"] = `Bearer ${feedback.data}`;
          res.setHeader("x-access-refresh", feedback.data);
        }
      } else {
        return res.status(401).send("Invalid Session");
      }
    }
    next();
  }

  static authorize(allowedRoles: Roles[]) {
    return (req: IRequest, res: Response, next: NextFunction) => {
      const authService = new AuthService();

      if (req.user && authService.authorize(req.user?.role, allowedRoles)) {
        return next();
      }
      res.status(403).send("Access forbidden");
    };
  }

  static ensureAuthenticated(req: IRequest, res: Response, next: NextFunction) {
    const authorization: any =
      req.headers.authorization || req.query.authorization;
    if (!authorization || !req.user) {
      return res.status(401).send("Not authenticated");
    }
    next();
  }
}
