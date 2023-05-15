"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const role_1 = require("../models/role");
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
class OrderRoute {
    constructor(app) {
        this.app = app;
        this.orderController = new order_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/orders/requisitions", session_manager_1.default.authorize([role_1.Roles.ADMIN, role_1.Roles.STOCK_MANAGER, role_1.Roles.HOD]), (req, res) => this.orderController.createRequisitionOrder(req, res));
        this.app.post("/api/orders", session_manager_1.default.authorize([role_1.Roles.ADMIN, role_1.Roles.STOCK_MANAGER, role_1.Roles.HOD]), (req, res) => this.orderController.createOrder(req, res));
        this.app.get("/api/orders", session_manager_1.default.authorize([role_1.Roles.ADMIN, role_1.Roles.STOCK_MANAGER, role_1.Roles.HOD]), (req, res) => this.orderController.getOrders(req, res));
        this.app.get("/api/orders/report", session_manager_1.default.authorize([role_1.Roles.ADMIN, role_1.Roles.STOCK_MANAGER, role_1.Roles.HOD]), (req, res) => this.orderController.getOrdersReport(req, res));
        this.app.put("/api/orders", session_manager_1.default.authorize([role_1.Roles.ADMIN, role_1.Roles.STOCK_MANAGER, role_1.Roles.HOD]), (req, res) => this.orderController.updateOrder(req, res));
        this.app.delete("/api/orders/:id", session_manager_1.default.authorize([role_1.Roles.ADMIN, role_1.Roles.STOCK_MANAGER, role_1.Roles.HOD]), (req, res) => this.orderController.deleteOrder(req, res));
    }
}
exports.default = OrderRoute;
//# sourceMappingURL=order.route.js.map