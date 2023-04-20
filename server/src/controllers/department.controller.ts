import { Request, Response } from "express";
import DepartmentService from "../services/department.service";
import validate from "../validators/validate";
import {
  DepartmentCreationSchema,
  DepartmentUpdateSchema,
} from "../validators/schema/department.schema";
import {
  DepartmentAttributes,
  DepartmentCreationAttributes,
} from "../models/department";

export default class DepartmentController {
  departmentService = new DepartmentService();

  async createDepartment(req: Request, res: Response) {
    const validation = await validate<DepartmentCreationAttributes>(
      DepartmentCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }

    const feedback = await this.departmentService.createDepartment(
      validation.data
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.status(201).send(feedback);
  }

  async getDepartments(req: Request, res: Response) {
    const search: any = req.query.search;
    const page = Number(req.query.page) || 1;

    const feedback = await this.departmentService.getDepartments(page, search);
    res.send(feedback);
  }

  async updateDepartment(req: Request, res: Response) {
    const validation = await validate<DepartmentAttributes>(
      DepartmentUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.departmentService.updateDepartment(
      validation.data
    );
    res.send(feedback);
  }

  async deleteDepartment(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      res.status(400).send("id is required");
    }
    const feedback = await this.departmentService.deleteDepartment(Number(id));
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    res.send(feedback);
  }
}
