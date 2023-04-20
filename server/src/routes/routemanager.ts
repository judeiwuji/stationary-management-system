import { Application } from "express";
import UserRoute from "./user.route";
import AuthRoute from "./auth.route";

export default class RouteManager {
  constructor(private app: Application) {
    this.register();
  }

  register() {
    new UserRoute(this.app);
    new AuthRoute(this.app);
  }
}
