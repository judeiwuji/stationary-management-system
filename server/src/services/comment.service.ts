import { Op } from "sequelize";
import Department, {
  DepartmentAttributes,
  DepartmentCreationAttributes,
} from "../models/department";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Comment, {
  CommentAttributes,
  CommentCreationAttributes,
} from "../models/comment";
import User from "../models/user";
import UserDTO from "../models/DTO/UserDTO";

export default class CommentService {
  async createComment(data: CommentCreationAttributes, user: User) {
    const feedback = new Feedback<Comment>();

    try {
      feedback.data = await Comment.create(
        {
          content: data.content,
          requisitionId: data.requisitionId,
          userId: user.id,
        },
        { include: [{ model: User, attributes: UserDTO }] }
      );
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async updateComment(data: CommentAttributes) {
    const feedback = new Feedback<Comment>();

    try {
      await Comment.update(
        { content: data.content },
        { where: { id: data.id } }
      );
      feedback.data = (await Comment.findByPk(data.id, {
        include: [{ model: User, attributes: UserDTO }],
      })) as Comment;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getComments(page = 1, requisitionId: number) {
    const feedback = new Feedback<Comment>();
    try {
      const pager = new Pagination(page);

      const { rows, count } = await Comment.findAndCountAll({
        where: { requisitionId },
        offset: pager.startIndex,
        limit: pager.pageSize,
        order: [["createdAt", "DESC"]],
        include: [{ model: User, attributes: UserDTO }],
      });
      feedback.results = rows;
      feedback.totalPages = pager.totalPages(count);
      feedback.page = page;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
      console.debug(error);
    }
    return feedback;
  }

  async deleteComment(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Comment.destroy({ where: { id } });
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
