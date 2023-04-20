import { Application } from "express";
import UserRoute from "./user.route";

export default class RouteManager {
  constructor(private app: Application) {
    this.register();
  }

  register() {
    new UserRoute(this.app);
  }
}
