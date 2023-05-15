"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const comment_controller_1 = __importDefault(require("../controllers/comment.controller"));
class CommentRoute {
    constructor(app) {
        this.app = app;
        this.commentController = new comment_controller_1.default();
        this.routes();
    }
    routes() {
        // this.app.post(
        //   "/api/comments",
        //   SessionManager.ensureAuthenticated,
        //   (req, res) => this.commentController.createComment(req, res)
        // );
        this.app.put("/api/comments", session_manager_1.default.ensureAuthenticated, (req, res) => this.commentController.updateComment(req, res));
        // this.app.get("/api/comments", (req, res) =>
        //   this.commentController.getComments(req, res)
        // );
        this.app.delete("/api/comments/:id", session_manager_1.default.ensureAuthenticated, (req, res) => this.commentController.deleteComment(req, res));
    }
}
exports.default = CommentRoute;
//# sourceMappingURL=comment.route.js.map