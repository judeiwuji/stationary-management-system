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
import { Roles } from "../models/role";
import User, { UserAttributes } from "../models/user";
import Verification, {
  VerificationCreationAttributes,
} from "../models/verification";

export default class VerificationService {
  async createVerification(
    data: VerificationCreationAttributes,
    user: UserAttributes
  ) {
    const feedback = new Feedback<Verification>();
    const transaction = await db.transaction();

    try {
      const audit = await Audit.findByPk(data.auditId, { transaction });

      if (!audit) {
        feedback.message = "Audit not found";
        feedback.success = false;
        await transaction.rollback();
        return feedback;
      }

      const { id } = await Verification.create({
        recommendationId: audit.recommendationId,
        requisitionId: audit.requisitionId,
        auditId: audit.id,
        status: data.status,
        userId: user.id,
      });

      await Audit.update(
        { status: data.status },
        { where: { id: audit.id }, transaction }
      );

      await Recommendation.update(
        { status: data.status },
        { where: { id: audit.recommendationId }, transaction }
      );

      await Requisition.update(
        { status: data.status },
        { where: { id: audit.requisitionId }, transaction }
      );
      await transaction.commit();

      feedback.data = (await Verification.findByPk(id, {
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
          {
            model: Audit,
            include: [{ model: User, attributes: UserDTO }],
          },
        ],
        attributes: [
          "id",
          "status",
          "requisitionId",
          "recommendationId",
          "auditId",
          "userId",
          "createdAt",
          "updatedAt",
          [
            db.cast(db.where(db.col("Verification.userId"), user.id), "int"),
            "isOwner",
          ],
        ],
      })) as Verification;
    } catch (error) {
      await transaction.rollback();
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getVerifications(page = 1, filters: any, user: User) {
    const feedback = new Feedback<Verification>();
    try {
      const query = filters ? { ...filters } : {};
      const pager = new Pagination(page);
      const { rows, count } = await Verification.findAndCountAll({
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
          {
            model: Audit,
            include: [{ model: User, attributes: UserDTO }],
          },
        ],
        attributes: [
          "id",
          "status",
          "requisitionId",
          "recommendationId",
          "auditId",
          "userId",
          "createdAt",
          "updatedAt",
          [
            db.cast(db.where(db.col("Verification.userId"), user.id), "int"),
            "isOwner",
          ],
          [
            db.cast(
              db.literal(`${Roles.PURCHASE_OFFICIER === user.role}`),
              "int"
            ),
            "isPurchaseOfficier",
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

  async updateVerification(data: AuditAttributes) {
    const feedback = new Feedback();
    const transaction = await db.transaction();

    try {
      const verification = await Verification.findByPk(data.id, {
        transaction,
      });

      if (!verification) {
        feedback.message = "Verification not found";
        feedback.success = false;
        await transaction.rollback();
        return feedback;
      }

      await Verification.update(
        {
          status: data.status,
        },
        { where: { id: data.id }, transaction }
      );

      await Audit.update(
        {
          status: data.status,
        },
        { where: { id: verification.auditId }, transaction }
      );

      await Recommendation.update(
        { status: data.status },
        { where: { id: verification.recommendationId }, transaction }
      );

      await Requisition.update(
        { status: data.status },
        { where: { id: verification.requisitionId }, transaction }
      );
      await transaction.commit();

      feedback.data = await Verification.findByPk(data.id, {
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
          {
            model: Audit,
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

  async deleteVerification(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Verification.destroy({ where: { id } });
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
