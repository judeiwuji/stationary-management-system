import UserDTO from "../models/DTO/UserDTO";
import Department from "../models/department";
import db from "../models/engine/sequelize";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Recommendation, {
  RecommendationAttributes,
  RecommendationCreationAttributes,
} from "../models/recommendation";
import Requisition from "../models/requisition";
import { RequisitionStatus } from "../models/requisition-status";
import { Roles } from "../models/role";
import User, { UserAttributes } from "../models/user";

export default class RecommendationService {
  async createRecommendation(
    data: RecommendationCreationAttributes,
    user: UserAttributes
  ) {
    const feedback = new Feedback<Recommendation>();
    const transaction = await db.transaction();

    try {
      feedback.data = await Recommendation.create(
        {
          requisitionId: data.requisitionId,
          status: data.status,
          userId: user.id,
        },
        {
          include: [
            { model: User, attributes: UserDTO },
            {
              model: Requisition,
              include: [{ model: User, attributes: UserDTO }],
            },
          ],
          transaction,
        }
      );
      await Requisition.update(
        { status: data.status },
        { where: { id: data.requisitionId }, transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getRecommendations(page = 1, filters: any, user: User) {
    const feedback = new Feedback<Recommendation>();
    try {
      const query = filters ? { ...filters } : {};
      const pager = new Pagination(page);
      const { rows, count } = await Recommendation.findAndCountAll({
        where: query,
        include: [
          { model: User, attributes: UserDTO },
          {
            model: Requisition,
            include: [
              { model: User, attributes: UserDTO },
              { model: Department },
            ],
          },
        ],
        attributes: [
          "id",
          "status",
          "requisitionId",
          "userId",
          "createdAt",
          "updatedAt",
          [
            db.cast(db.where(db.col("Recommendation.userId"), user.id), "int"),
            "isOwner",
          ],
          [
            db.cast(db.literal(`${user.role === Roles.AUDITOR}`), "int"),
            "isAuditor",
          ],
        ],
        order: [["createdAt", "DESC"]],
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

  async updateRecommendation(data: RecommendationAttributes) {
    const feedback = new Feedback();
    const transaction = await db.transaction();

    try {
      const recommedation = await Recommendation.findByPk(data.id, {
        transaction,
      });
      if (!recommedation) {
        feedback.message = "Recommendation not found";
        feedback.success = false;
        await transaction.rollback();
        return feedback;
      }

      await Recommendation.update(
        {
          status: data.status,
        },
        { where: { id: data.id }, transaction }
      );

      await Requisition.update(
        { status: data.status },
        { where: { id: recommedation.requisitionId }, transaction }
      );
      transaction.commit();

      feedback.data = await Recommendation.findByPk(data.id, {
        include: [
          { model: User, attributes: UserDTO },
          {
            model: Requisition,
            include: [{ model: User, attributes: UserDTO }],
          },
        ],
      });
    } catch (error) {
      await transaction.rollback();
      feedback.success = false;
      feedback.message = Errors.updateMessage;
      console.debug(error);
    }
    return feedback;
  }

  async deleteRecommendation(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Recommendation.destroy({ where: { id } });
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
