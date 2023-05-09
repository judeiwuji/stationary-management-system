import { Application } from "express";
import UserRoute from "./user.route";
import AuthRoute from "./auth.route";
import DepartmentRoute from "./department.route";
import RequisitionRoute from "./requisition.route";
import RecommendationRoute from "./recommendation.route";
import AuditRoute from "./audit.route";
import VerificationRoute from "./verification.route";
import ReceiptRoute from "./receipt.route";
import StockRoute from "./stock.route";
import CommentRoute from "./comment.route";
import OrderRoute from "./order.route";
import DashboardRoute from "./dashbard.route";
import InboxRoute from "./inbox.route";
import MessageRoute from "./message.route";
import CartRoute from "./cart.route";

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
    new StockRoute(this.app);
    new CommentRoute(this.app);
    new OrderRoute(this.app);
    new DashboardRoute(this.app);
    new InboxRoute(this.app);
    new MessageRoute(this.app);
    new CartRoute(this.app);
  }
}
