"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
class DashboardRoute {
    constructor(app) {
        this.app = app;
        this.dashboardController = new dashboard_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.get("/api/dashboard/analytics", session_manager_1.default.ensureAuthenticated, (req, res) => this.dashboardController.getAnalytics(req, res));
    }
}
exports.default = DashboardRoute;
//# sourceMappingURL=dashbard.route.js.map