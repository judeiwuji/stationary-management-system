"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inbox_controller_1 = __importDefault(require("../controllers/inbox.controller"));
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
class InboxRoute {
    constructor(app) {
        this.app = app;
        this.inboxController = new inbox_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/inbox", session_manager_1.default.ensureAuthenticated, (req, res) => this.inboxController.createInbox(req, res));
        this.app.get("/api/inbox", session_manager_1.default.ensureAuthenticated, (req, res) => this.inboxController.getAllInbox(req, res));
        this.app.get("/api/inbox/hasNewMessages", session_manager_1.default.ensureAuthenticated, (req, res) => this.inboxController.hasNewInboxMessages(req, res));
        this.app.get("/api/inbox/:id", session_manager_1.default.ensureAuthenticated, (req, res) => this.inboxController.getInbox(req, res));
    }
}
exports.default = InboxRoute;
//# sourceMappingURL=inbox.route.js.map