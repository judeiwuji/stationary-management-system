import { Op } from "sequelize";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Receipt, { ReceiptCreationAttributes } from "../models/receipt";
import UserDTO from "../models/DTO/UserDTO";
import User from "../models/user";
import RequisitionItem from "../models/requisition_item";

export default class ReceiptService {
  async createReceipt(data: ReceiptCreationAttributes, user: User) {
    const feedback = new Feedback<Receipt>();

    try {
      feedback.data = await Receipt.create({
        image: data.image,
        requisitionItemId: data.requisitionItemId,
        userId: user.id,
      });
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getReceipts(page = 1, search: string) {
    const feedback = new Feedback();
    try {
      const pager = new Pagination();
      let query = {};
      query = search
        ? {
            [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
          }
        : query;
      feedback.results = await Receipt.findAll({
        where: query,
        offset: pager.startIndex,
        limit: pager.pageSize,
        order: [["createdAt", "ASC"]],
        include: [{ model: User, attributes: UserDTO }, RequisitionItem],
      });
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
