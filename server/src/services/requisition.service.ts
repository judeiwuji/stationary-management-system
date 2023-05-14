import { Op } from "sequelize";
import UserDTO from "../models/DTO/UserDTO";
import Comment from "../models/comment";
import Department from "../models/department";
import db from "../models/engine/sequelize";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Receipt from "../models/receipt";
import Requisition, {
  RequisitionAttributes,
  RequisitionCreationAttributes,
} from "../models/requisition";
import { RequisitionStatus } from "../models/requisition-status";
import RequisitionItem, {
  RequisitionItemAttributes,
  RequisitionItemCreationAttributes,
} from "../models/requisition_item";
import { Roles } from "../models/role";
import Stock from "../models/stock";
import User, { UserAttributes } from "../models/user";

export default class RequisitionService {
  async createRequisition(
    data: RequisitionCreationAttributes,
    user: UserAttributes
  ) {
    const feedback = new Feedback<Requisition>();
    const transaction = await db.transaction();

    try {
      const requisition = await Requisition.create(
        {
          description: data.description,
          destination: data.destination,
          through: data.through,
          sourceId: data.sourceId,
          status: RequisitionStatus.PENDING,
          userId: user.id,
        },
        { transaction }
      );
      const items: RequisitionItemCreationAttributes[] = data.items
        ? data.items.map((d) => ({
            price: d.price,
            quantity: d.quantity,
            requisitionId: requisition.id,
            stockId: d.stockId,
          }))
        : [];
      await RequisitionItem.bulkCreate(items, { transaction });
      transaction.commit();

      feedback.data = (await Requisition.findByPk(requisition.id, {
        include: [
          { model: User, attributes: UserDTO },
          {
            model: RequisitionItem,
            include: [{ model: Stock, attributes: ["name"] }],
          },
          {
            model: Department,
            attributes: ["name"],
          },
          { model: Comment, limit: 15, order: [["createdAt", "DESC"]] },
        ],
      })) as Requisition;
    } catch (error) {
      await transaction.rollback();
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getRequisitions(page = 1, filters: any, user: User) {
    const feedback = new Feedback<Requisition>();
    try {
      let query = {};
      query = filters ? { ...filters, ...query } : query;
      if (user.role === Roles.HOD || user.role === Roles.STOCK_MANAGER) {
        query = { ...query, userId: user.id };
      }
      const pager = new Pagination(page);
      feedback.results = await Requisition.findAll({
        where: query,
        attributes: [
          "id",
          "userId",
          "sourceId",
          "through",
          "destination",
          "description",
          "status",
          "createdAt",
          [
            db.cast(db.where(db.col("Requisition.userId"), user.id), "int"),
            "isOwner",
          ],
          [db.literal(`${user.role === Roles.AUDITOR}`), "isAuditor"],
          [db.literal(`${user.role === Roles.BURSAR}`), "isBursar"],
          [db.literal(`${user.role === Roles.RECTOR}`), "isRector"],
          [
            db.cast(
              db.literal(`${Roles.PURCHASE_OFFICIER === user.role}`),
              "int"
            ),
            "isPurchaseOfficier",
          ],
          [
            db.literal(`${user.role === Roles.STOCK_MANAGER}`),
            "isStockManager",
          ],
        ],
        include: [
          { model: User, attributes: UserDTO },
          {
            model: RequisitionItem,
            include: [{ model: Stock, attributes: ["name"] }, Receipt],
            required: true,
          },
          {
            model: Department,
            attributes: ["name"],
          },
        ],
        offset: pager.startIndex,
        limit: pager.pageSize,
        order: [["createdAt", "DESC"]],
      });

      feedback.totalPages = pager.totalPages(
        await Requisition.count({ where: query })
      );
      feedback.page = page;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getRequisition(id: number, user: User) {
    const feedback = new Feedback<Requisition>();
    try {
      feedback.data = (await Requisition.findByPk(id, {
        attributes: [
          "id",
          "userId",
          "sourceId",
          "through",
          "destination",
          "description",
          "status",
          "createdAt",
          [
            db.cast(db.where(db.col("Requisition.userId"), user.id), "int"),
            "isOwner",
          ],
          [db.literal(`${user.role === Roles.BURSAR}`), "isBursar"],
          [db.literal(`${user.role === Roles.AUDITOR}`), "isAuditor"],
          [db.literal(`${user.role === Roles.RECTOR}`), "isRector"],
          [
            db.cast(
              db.literal(`${Roles.PURCHASE_OFFICIER === user.role}`),
              "int"
            ),
            "isPurchaseOfficier",
          ],
          [
            db.literal(`${user.role === Roles.STOCK_MANAGER}`),
            "isStockManager",
          ],
        ],
        include: [
          { model: User, attributes: UserDTO },
          {
            model: RequisitionItem,
            include: [
              { model: Stock, attributes: ["name"] },
              { model: Receipt },
            ],
          },
          {
            model: Department,
            attributes: ["name"],
          },
        ],
      })) as Requisition;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
      console.debug(error);
    }
    return feedback;
  }

  async updateRequisition(data: RequisitionAttributes) {
    const feedback = new Feedback();

    try {
      await Requisition.update(
        {
          description: data.description,
          destination: data.destination,
          through: data.through,
          sourceId: data.sourceId,
          status: data.status,
        },
        { where: { id: data.id } }
      );
      feedback.data = await Requisition.findByPk(data.id, {
        include: [
          { model: User, attributes: UserDTO },
          {
            model: RequisitionItem,
            include: [{ model: Stock, attributes: ["name"] }],
          },
          {
            model: Department,
            attributes: ["name"],
          },
          { model: Comment, limit: 15, order: [["createdAt", "DESC"]] },
        ],
      });
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.updateMessage;
      console.debug(error);
    }
    return feedback;
  }

  async deleteRequisition(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Requisition.destroy({ where: { id } });
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

  async addRequisitionItem(data: RequisitionItemCreationAttributes) {
    const feedback = new Feedback();

    try {
      const { id } = await RequisitionItem.create(
        {
          price: data.price,
          quantity: data.quantity,
          stockId: data.stockId,
          requisitionId: data.requisitionId,
        },
        { include: [{ model: Stock, attributes: ["name"] }] }
      );
      feedback.data = (await RequisitionItem.findByPk(id, {
        include: [{ model: Stock, attributes: ["name"] }],
      })) as RequisitionItem;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async deleteRequisitionItem(id: number) {
    const feedback = new Feedback();

    try {
      const result = await RequisitionItem.destroy({ where: { id } });
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

  async getRequisitionsReport(user: User) {
    const feedback = new Feedback<any>();
    try {
      const today = new Date();
      const year = today.getFullYear();
      console.log(today.getMonth());
      const month = today.getMonth() + 1;
      const totalDays = new Date(year, month, 0).getDate();
      const monthStart = new Date(`${year}-${month}-1 00:00:00`);
      const monthEnd = new Date(`${year}-${month}-${totalDays} 23:00:00`);

      console.log(year, month, totalDays);
      console.log(monthEnd);
      let query = {
        userId: user.id,
        createdAt: {
          [Op.and]: [{ [Op.gte]: monthStart }, { [Op.lte]: monthEnd }],
        },
      };
      feedback.results = await Requisition.count({
        attributes: ["status", "createdAt"],
        group: ["status"],
        where: query,
      });
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
      console.debug(error);
    }
    return feedback;
  }
}
