"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
class AuthRoute {
    constructor(app) {
        this.app = app;
        this.authController = new auth_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/auth/login", (req, res) => this.authController.login(req, res));
        this.app.post("/api/auth/logout", (req, res) => this.authController.logout(req, res));
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=auth.route.js.map