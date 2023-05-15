"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = __importDefault(require("./user.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const department_route_1 = __importDefault(require("./department.route"));
const requisition_route_1 = __importDefault(require("./requisition.route"));
const recommendation_route_1 = __importDefault(require("./recommendation.route"));
const audit_route_1 = __importDefault(require("./audit.route"));
const verification_route_1 = __importDefault(require("./verification.route"));
const receipt_route_1 = __importDefault(require("./receipt.route"));
const stock_route_1 = __importDefault(require("./stock.route"));
const comment_route_1 = __importDefault(require("./comment.route"));
const order_route_1 = __importDefault(require("./order.route"));
const dashbard_route_1 = __importDefault(require("./dashbard.route"));
const inbox_route_1 = __importDefault(require("./inbox.route"));
const message_route_1 = __importDefault(require("./message.route"));
const cart_route_1 = __importDefault(require("./cart.route"));
class RouteManager {
    constructor(app) {
        this.app = app;
        this.register();
    }
    register() {
        new user_route_1.default(this.app);
        new auth_route_1.default(this.app);
        new department_route_1.default(this.app);
        new requisition_route_1.default(this.app);
        new recommendation_route_1.default(this.app);
        new audit_route_1.default(this.app);
        new verification_route_1.default(this.app);
        new receipt_route_1.default(this.app);
        new stock_route_1.default(this.app);
        new comment_route_1.default(this.app);
        new order_route_1.default(this.app);
        new dashbard_route_1.default(this.app);
        new inbox_route_1.default(this.app);
        new message_route_1.default(this.app);
        new cart_route_1.default(this.app);
    }
}
exports.default = RouteManager;
//# sourceMappingURL=routemanager.js.map