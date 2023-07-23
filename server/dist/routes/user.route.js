"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const role_1 = require("../models/role");
class UserRoute {
    constructor(app) {
        this.app = app;
        this.userController = new user_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post('/api/users', 
        // SessionManager.ensureAuthenticated,
        // SessionManager.authorize([Roles.ADMIN]),
        (req, res) => this.userController.createUser(req, res));
        this.app.put('/api/users', session_manager_1.default.ensureAuthenticated, (req, res) => this.userController.updateUser(req, res));
        this.app.get('/api/users', session_manager_1.default.ensureAuthenticated, (req, res) => this.userController.getUsers(req, res));
        this.app.delete('/api/users/:id?', session_manager_1.default.ensureAuthenticated, session_manager_1.default.authorize([role_1.Roles.ADMIN]), (req, res) => this.userController.deleteUser(req, res));
        this.app.get('/api/users/identify', (req, res) => this.userController.identifyUser(req, res));
        this.app.post('/api/users/reset/password', (req, res) => this.userController.resetPassword(req, res));
    }
}
exports.default = UserRoute;
//# sourceMappingURL=user.route.js.map