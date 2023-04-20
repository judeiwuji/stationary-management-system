import { Application } from "express";
import UserRoute from "./user.route";
import AuthRoute from "./auth.route";
import DepartmentRoute from "./department.route";
import RequisitionRoute from "./requisition.route";

export default class RouteManager {
  constructor(private app: Application) {
    this.register();
  }

  register() {
    new UserRoute(this.app);
    new AuthRoute(this.app);
    new DepartmentRoute(this.app);
    new RequisitionRoute(this.app);
  }
}
