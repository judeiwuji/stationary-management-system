"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recommendation_controller_1 = __importDefault(require("../controllers/recommendation.controller"));
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const role_1 = require("../models/role");
class RecommendationRoute {
    constructor(app) {
        this.app = app;
        this.recommdendationController = new recommendation_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/recommendations/", session_manager_1.default.authorize([role_1.Roles.BURSAR]), (req, res) => this.recommdendationController.createRecommendation(req, res));
        this.app.get("/api/recommendations/", session_manager_1.default.authorize([role_1.Roles.BURSAR, role_1.Roles.AUDITOR]), (req, res) => this.recommdendationController.getRecommendations(req, res));
        this.app.put("/api/recommendations/", session_manager_1.default.authorize([role_1.Roles.BURSAR, role_1.Roles.AUDITOR]), (req, res) => this.recommdendationController.updateRecommendation(req, res));
        this.app.delete("/api/recommendations/:id", session_manager_1.default.authorize([role_1.Roles.BURSAR]), (req, res) => this.recommdendationController.deleteRecommendation(req, res));
    }
}
exports.default = RecommendationRoute;
//# sourceMappingURL=recommendation.route.js.map