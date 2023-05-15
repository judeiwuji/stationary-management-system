"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const requisition_controller_1 = __importDefault(require("../controllers/requisition.controller"));
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const role_1 = require("../models/role");
const comment_controller_1 = __importDefault(require("../controllers/comment.controller"));
class RequisitionRoute {
    constructor(app) {
        this.app = app;
        this.requisitionController = new requisition_controller_1.default();
        this.commentController = new comment_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/requisitions", session_manager_1.default.authorize([role_1.Roles.HOD, role_1.Roles.STOCK_MANAGER]), (req, res) => this.requisitionController.createRequisition(req, res));
        this.app.get("/api/requisitions/report", session_manager_1.default.ensureAuthenticated, (req, res) => this.requisitionController.getRequisitionReport(req, res));
        this.app.get("/api/requisitions", session_manager_1.default.authorize([
            role_1.Roles.HOD,
            role_1.Roles.STOCK_MANAGER,
            role_1.Roles.BURSAR,
            role_1.Roles.AUDITOR,
            role_1.Roles.PURCHASE_OFFICIER,
            role_1.Roles.RECTOR,
        ]), (req, res) => this.requisitionController.getRequisitions(req, res));
        this.app.get("/api/requisitions/:id", session_manager_1.default.authorize([
            role_1.Roles.HOD,
            role_1.Roles.STOCK_MANAGER,
            role_1.Roles.BURSAR,
            role_1.Roles.AUDITOR,
            role_1.Roles.PURCHASE_OFFICIER,
            role_1.Roles.RECTOR,
        ]), (req, res) => this.requisitionController.getRequisition(req, res));
        this.app.put("/api/requisitions", session_manager_1.default.authorize([
            role_1.Roles.HOD,
            role_1.Roles.STOCK_MANAGER,
            role_1.Roles.BURSAR,
            role_1.Roles.PURCHASE_OFFICIER,
        ]), (req, res) => this.requisitionController.updateRequisition(req, res));
        this.app.delete("/api/requisitions/:id", session_manager_1.default.authorize([role_1.Roles.HOD, role_1.Roles.STOCK_MANAGER]), (req, res) => this.requisitionController.deleteRequisition(req, res));
        this.app.post("/api/requisitions/items", session_manager_1.default.authorize([role_1.Roles.HOD, role_1.Roles.STOCK_MANAGER, role_1.Roles.BURSAR]), (req, res) => this.requisitionController.addRequisitionItem(req, res));
        this.app.delete("/api/requisitions/items/:id", session_manager_1.default.authorize([role_1.Roles.HOD, role_1.Roles.STOCK_MANAGER, role_1.Roles.BURSAR]), (req, res) => this.requisitionController.deleteRequisitionItem(req, res));
        this.app.post("/api/requisitions/:id/comments", session_manager_1.default.ensureAuthenticated, (req, res) => this.commentController.createComment(req, res));
        this.app.get("/api/requisitions/:id/comments", session_manager_1.default.ensureAuthenticated, (req, res) => this.commentController.getComments(req, res));
    }
}
exports.default = RequisitionRoute;
//# sourceMappingURL=requisition.route.js.map