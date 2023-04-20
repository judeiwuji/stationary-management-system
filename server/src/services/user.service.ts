import { Op } from "sequelize";
import UserDTO from "../models/DTO/UserDTO";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import { Roles } from "../models/role";
import User, { UserAttributes, UserCreationAttributes } from "../models/user";
import { hash, genSalt } from "bcryptjs";

export default class UserService {
  async createUser(data: UserCreationAttributes) {
    const feedback = new Feedback<User>();
    try {
      const emailExists = await User.findOne({ where: { email: data.email } });

      if (emailExists) {
        feedback.success = false;
        feedback.message = "Email already exists";
        return feedback;
      }

      const salt = await genSalt(10);
      const password = await hash(data.password, salt);
      const role =
        typeof data.role === "number" ? data.role : Number(Roles[data.role]);
      const { id } = await User.create({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        role,
        password,
      });
      feedback.data = (await User.findByPk(id, {
        attributes: UserDTO,
      })) as User;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.log(error);
    }
    return feedback;
  }

  async updateUser(data: UserAttributes) {
    const feedback = new Feedback<User>();

    try {
      const role =
        typeof data.role === "number" ? data.role : Number(Roles[data.role]);
      await User.update(
        { firstname: data.firstname, lastname: data.lastname, role },
        { where: { id: data.id } }
      );
      feedback.data = (await User.findByPk<User>(data.id, {
        attributes: UserDTO,
      })) as User;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.updateMessage;
    }
    return feedback;
  }

  async deleteUser(id: number) {
    const feedback = new Feedback<number>();

    try {
      feedback.data = await User.destroy({ where: { id } });
      if (feedback.data === 0) {
        feedback.success = false;
        feedback.message = "Not found";
      }
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.deleteMessage;
    }
    return feedback;
  }

  async getUsers(page = 1, filters: any, search: any) {
    const feedback = new Feedback<User>();

    try {
      const pager = new Pagination(page);
      let query = {};
      console.log(search);
      query = search
        ? {
            [Op.or]: {
              firstname: { [Op.like]: `%${search}%` },
              lastname: { [Op.like]: `%${search}%` },
              email: { [Op.like]: `%${search}%` },
            },
          }
        : query;
      query = filters ? { ...query, ...filters } : query;

      feedback.page = page;
      feedback.results = await User.findAll({
        attributes: UserDTO,
        offset: pager.startIndex,
        limit: pager.pageSize,
        where: query,
      });
      feedback.totalPages = pager.totalPages(
        await User.count({ where: query }),
        pager.pageSize
      );
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
    }
    return feedback;
  }
}
