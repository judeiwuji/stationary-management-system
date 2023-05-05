import { Op } from "sequelize";
import Department, {
  DepartmentAttributes,
  DepartmentCreationAttributes,
} from "../models/department";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";

export default class DepartmentService {
  async createDepartment(data: DepartmentCreationAttributes) {
    const feedback = new Feedback<Department>();

    try {
      feedback.data = await Department.create({ name: data.name });
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async updateDepartment(data: DepartmentAttributes) {
    const feedback = new Feedback<Department>();

    try {
      await Department.update({ name: data.name }, { where: { id: data.id } });
      feedback.data = (await Department.findByPk(data.id)) as Department;
    } catch (error: any) {
      feedback.success = false;
      if (error.name === "SequelizeUniqueConstraintError") {
        feedback.message = "Department already exists";
      } else {
        feedback.message = Errors.updateMessage;
      }
      console.debug(error);
    }
    return feedback;
  }

  async getDepartments(page = 1, search: string) {
    const feedback = new Feedback();
    try {
      const pager = new Pagination(page);
      let query = {};
      query = search
        ? {
            [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
          }
        : query;
      const { count, rows } = await Department.findAndCountAll({
        where: query,
        offset: pager.startIndex,
        limit: pager.pageSize,
        order: [["name", "ASC"]],
      });
      feedback.results = rows;
      feedback.totalPages = pager.totalPages(count);
      feedback.page = pager.page;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
      console.debug(error);
    }
    return feedback;
  }

  async deleteDepartment(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Department.destroy({ where: { id } });
      if (result === 0) {
        feedback.success = false;
        feedback.message = "Not found";
      }
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.deleteMessage;
      console.debug(error);
    }
    return feedback;
  }
}
