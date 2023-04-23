import { Application } from "express";
import UserRoute from "./user.route";
import AuthRoute from "./auth.route";
import DepartmentRoute from "./department.route";
import RequisitionRoute from "./requisition.route";
import RecommendationRoute from "./recommendation.route";
import AuditRoute from "./audit.route";
import VerificationRoute from "./verification.route";
import ReceiptRoute from "./receipt.route";

export default class RouteManager {
  constructor(private app: Application) {
    this.register();
  }

  register() {
    new UserRoute(this.app);
    new AuthRoute(this.app);
    new DepartmentRoute(this.app);
    new RequisitionRoute(this.app);
    new RecommendationRoute(this.app);
    new AuditRoute(this.app);
    new VerificationRoute(this.app);
    new ReceiptRoute(this.app);
  }
}
