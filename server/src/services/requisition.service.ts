import { Transaction } from "sequelize";
import db from "../models/engine/sequelize";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Requisition, {
  RequisitionAttributes,
  RequisitionCreationAttributes,
} from "../models/requisition";
import { RequisitionStatus } from "../models/requisition-status";
import RequisitionItem, {
  RequisitionItemAttributes,
  RequisitionItemCreationAttributes,
} from "../models/requisition_item";
import { UserAttributes } from "../models/user";

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
            name: d.name,
            price: d.price,
            quantity: d.quantity,
            requisitionId: requisition.id,
            stockId: d.stockId,
          }))
        : [];
      await RequisitionItem.bulkCreate(items, { transaction });
      transaction.commit();

      feedback.data = (await Requisition.findByPk(requisition.id, {
        include: [RequisitionItem],
      })) as Requisition;
    } catch (error) {
      await transaction.rollback();
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getRequisitions(page = 1, filters: any) {
    const feedback = new Feedback<Requisition>();
    try {
      const query = filters ? { ...filters } : {};
      const pager = new Pagination(page);
      const { rows, count } = await Requisition.findAndCountAll({
        where: query,
        include: [RequisitionItem],
        offset: pager.startIndex,
        limit: pager.pageSize,
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
      feedback.data = await Requisition.findByPk(data.id);
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
      feedback.data = await RequisitionItem.create({
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        stockId: data.stockId,
        requisitionId: data.requisitionId,
      });
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
}
