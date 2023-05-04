import { Op } from "sequelize";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Receipt, { ReceiptCreationAttributes } from "../models/receipt";
import UserDTO from "../models/DTO/UserDTO";
import User from "../models/user";
import RequisitionItem from "../models/requisition_item";
import db from "../models/engine/sequelize";
import Stock from "../models/stock";

export default class ReceiptService {
  async createReceipt(data: ReceiptCreationAttributes, user: User) {
    const feedback = new Feedback<Receipt>();
    const transaction = await db.transaction();

    try {
      const requisitionItem = await RequisitionItem.findByPk(
        data.requisitionItemId,
        { include: [Stock] }
      );
      if (!requisitionItem) {
        feedback.success = false;
        feedback.message = "Item not found";
        transaction.rollback();
        return feedback;
      }

      requisitionItem.stock.quantity += requisitionItem.quantity;
      requisitionItem.stock.save({ transaction });
      feedback.data = await Receipt.create(
        {
          image: data.image,
          requisitionItemId: data.requisitionItemId,
          userId: user.id,
        },
        { transaction }
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

  async getReceipts(page = 1, search: string) {
    const feedback = new Feedback();
    try {
      const pager = new Pagination(page);
      let query = {};
      query = search
        ? {
            [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
          }
        : query;
      const { count, rows } = await Receipt.findAndCountAll({
        where: query,
        offset: pager.startIndex,
        limit: pager.pageSize,
        order: [["createdAt", "ASC"]],
        include: [
          { model: User, attributes: UserDTO },
          { model: RequisitionItem, include: [Stock] },
        ],
      });
      feedback.results = rows;
      feedback.page = page;
      feedback.totalPages = pager.totalPages(count);
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
      console.debug(error);
    }
    return feedback;
  }

  async deleteReceipt(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Receipt.destroy({ where: { id } });
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
