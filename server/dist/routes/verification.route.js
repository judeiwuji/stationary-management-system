"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const role_1 = require("../models/role");
const verification_controller_1 = __importDefault(require("../controllers/verification.controller"));
class VerificationRoute {
    constructor(app) {
        this.app = app;
        this.verifyController = new verification_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/verifications/", session_manager_1.default.authorize([role_1.Roles.RECTOR]), (req, res) => this.verifyController.createVerification(req, res));
        this.app.get("/api/verifications/", session_manager_1.default.authorize([role_1.Roles.RECTOR, role_1.Roles.PURCHASE_OFFICIER]), (req, res) => this.verifyController.getVerifications(req, res));
        this.app.put("/api/verifications/", session_manager_1.default.authorize([role_1.Roles.RECTOR]), (req, res) => this.verifyController.updateVerification(req, res));
        this.app.delete("/api/verifications/:id", session_manager_1.default.authorize([role_1.Roles.RECTOR]), (req, res) => this.verifyController.deleteVerification(req, res));
    }
}
exports.default = VerificationRoute;
//# sourceMappingURL=verification.route.js.map