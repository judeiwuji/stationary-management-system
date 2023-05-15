"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_controller_1 = __importDefault(require("../controllers/message.controller"));
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
class MessageRoute {
    constructor(app) {
        this.app = app;
        this.messageController = new message_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/inbox/:id/messages", session_manager_1.default.ensureAuthenticated, (req, res) => this.messageController.createMessage(req, res));
        this.app.put("/api/inbox/:id/messages", session_manager_1.default.ensureAuthenticated, (req, res) => this.messageController.updateMessage(req, res));
        this.app.get("/api/inbox/:id/messages", session_manager_1.default.ensureAuthenticated, (req, res) => this.messageController.getMessages(req, res));
        this.app.get("/api/messages/count/unread", session_manager_1.default.ensureAuthenticated, (req, res) => this.messageController.countUnReadMessages(req, res));
    }
}
exports.default = MessageRoute;
//# sourceMappingURL=message.route.js.map