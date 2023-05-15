"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const department_controller_1 = __importDefault(require("../controllers/department.controller"));
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const role_1 = require("../models/role");
class DepartmentRoute {
    constructor(app) {
        this.app = app;
        this.departmentController = new department_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/departments", session_manager_1.default.authorize([role_1.Roles.ADMIN]), (req, res) => this.departmentController.createDepartment(req, res));
        this.app.put("/api/departments", session_manager_1.default.authorize([role_1.Roles.ADMIN]), (req, res) => this.departmentController.updateDepartment(req, res));
        this.app.get("/api/departments", (req, res) => this.departmentController.getDepartments(req, res));
        this.app.delete("/api/departments/:id", session_manager_1.default.authorize([role_1.Roles.ADMIN]), (req, res) => this.departmentController.deleteDepartment(req, res));
    }
}
exports.default = DepartmentRoute;
//# sourceMappingURL=department.route.js.map