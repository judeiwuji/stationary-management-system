"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const role_1 = require("../models/role");
const audit_controller_1 = __importDefault(require("../controllers/audit.controller"));
class AuditRoute {
    constructor(app) {
        this.app = app;
        this.auditController = new audit_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/audits/", session_manager_1.default.authorize([role_1.Roles.AUDITOR]), (req, res) => this.auditController.createAudit(req, res));
        this.app.get("/api/audits/", session_manager_1.default.authorize([role_1.Roles.AUDITOR, role_1.Roles.RECTOR]), (req, res) => this.auditController.getAudits(req, res));
        this.app.put("/api/audits/", session_manager_1.default.authorize([role_1.Roles.AUDITOR, role_1.Roles.RECTOR]), (req, res) => this.auditController.updateAudit(req, res));
        this.app.delete("/api/audits/:id", session_manager_1.default.authorize([role_1.Roles.AUDITOR]), (req, res) => this.auditController.deleteAudit(req, res));
    }
}
exports.default = AuditRoute;
//# sourceMappingURL=audit.route.js.map