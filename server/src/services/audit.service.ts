import UserDTO from "../models/DTO/UserDTO";
import Audit, {
  AuditAttributes,
  AuditCreationAttributes,
} from "../models/audit";
import db from "../models/engine/sequelize";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Recommendation from "../models/recommendation";
import Requisition from "../models/requisition";
import { RequisitionStatus } from "../models/requisition-status";
import { Roles } from "../models/role";
import User, { UserAttributes } from "../models/user";

export default class AuditService {
  async createAudit(data: AuditCreationAttributes, user: UserAttributes) {
    const feedback = new Feedback<Audit>();
    const transaction = await db.transaction();

    try {
      const recommedation = await Recommendation.findByPk(
        data.recommendationId,
        { transaction }
      );

      if (!recommedation) {
        feedback.message = "Recommendation not found";
        feedback.success = false;
        await transaction.rollback();
        return feedback;
      }

      const { id } = await Audit.create(
        {
          recommendationId: recommedation.id,
          requisitionId: recommedation.requisitionId,
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
            {
              model: Recommendation,
              include: [{ model: User, attributes: UserDTO }],
            },
          ],
          transaction,
        }
      );

      await Recommendation.update(
        { status: data.status },
        { where: { id: recommedation.id }, transaction }
      );

      await Requisition.update(
        { status: data.status },
        { where: { id: recommedation.requisitionId }, transaction }
      );
      await transaction.commit();

      feedback.data = (await Audit.findByPk(id, {
        include: [
          { model: User, attributes: UserDTO },
          {
            model: Requisition,
            include: [{ model: User, attributes: UserDTO }],
          },
          {
            model: Recommendation,
            include: [{ model: User, attributes: UserDTO }],
          },
        ],
      })) as Audit;
    } catch (error) {
      await transaction.rollback();
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getAudits(page = 1, filters: any, user: User) {
    const feedback = new Feedback<Audit>();
    try {
      const query = filters ? { ...filters } : {};
      const pager = new Pagination(page);
      const { rows, count } = await Audit.findAndCountAll({
        where: query,
        include: [
          { model: User, attributes: UserDTO },
          {
            model: Requisition,
            include: [{ model: User, attributes: UserDTO }],
          },
          {
            model: Recommendation,
            include: [{ model: User, attributes: UserDTO }],
          },
        ],
        attributes: [
          "id",
          "status",
          "requisitionId",
          "recommendationId",
          "userId",
          "createdAt",
          "updatedAt",
          [
            db.cast(db.where(db.col("Audit.userId"), user.id), "int"),
            "isOwner",
          ],
        ],
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

  async updateAudit(data: AuditAttributes) {
    const feedback = new Feedback();
    const transaction = await db.transaction();

    try {
      const audit = await Audit.findByPk(data.id, { transaction });

      if (!audit) {
        feedback.message = "Audit not found";
        feedback.success = false;
        await transaction.rollback();
        return feedback;
      }

      await Audit.update(
        {
          status: data.status,
        },
        { where: { id: data.id }, transaction }
      );

      await Recommendation.update(
        { status: data.status },
        { where: { id: audit.recommendationId }, transaction }
      );

      await Requisition.update(
        { status: data.status },
        { where: { id: audit.requisitionId }, transaction }
      );
      transaction.commit();

      feedback.data = await Audit.findByPk(data.id, {
        include: [
          { model: User, attributes: UserDTO },
          {
            model: Requisition,
            include: [{ model: User, attributes: UserDTO }],
          },
          {
            model: Recommendation,
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

  async deleteAudit(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Audit.destroy({ where: { id } });
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
