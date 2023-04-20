import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import DepartmentController from "../controllers/department.controller";
import SessionManager from "../middlewares/session-manager";
import { Roles } from "../models/role";

export default class DepartmentRoute implements IRoute {
  departmentController = new DepartmentController();
  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/departments",
      SessionManager.authorize([Roles.ADMIN]),
      (req, res) => this.departmentController.createDepartment(req, res)
    );

    this.app.put(
      "/api/departments",
      SessionManager.authorize([Roles.ADMIN]),
      (req, res) => this.departmentController.updateDepartment(req, res)
    );

    this.app.get("/api/departments", (req, res) =>
      this.departmentController.getDepartments(req, res)
    );

    this.app.delete(
      "/api/departments/:id",
      SessionManager.authorize([Roles.ADMIN]),
      (req, res) => this.departmentController.deleteDepartment(req, res)
    );
  }
}
