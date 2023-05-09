import { Op } from "sequelize";
import db from "../models/engine/sequelize";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Stock, {
  StockAttributes,
  StockCreationAttributes,
} from "../models/stock";
import { UserAttributes } from "../models/user";
import Cart from "../models/cart";

export default class StockService {
  async createStock(data: StockCreationAttributes, user: UserAttributes) {
    const feedback = new Feedback<Stock>();
    try {
      feedback.data = await Stock.create({
        quantity: 0,
        name: data.name,
      });
    } catch (error: any) {
      console.log(error.name);
      if (error.name === "SequelizeUniqueConstraintError") {
        feedback.message = "Stock already exists";
      } else {
        feedback.message = Errors.createMessage;
      }
      feedback.success = false;

      console.debug(error);
    }
    return feedback;
  }

  async getStocks(page = 1, search = "", filters: any) {
    const feedback = new Feedback<Stock>();
    try {
      let query = {};
      query = filters ? { ...filters, ...query } : query;
      if (search) {
        query = {
          ...query,
          name: { [Op.like]: `%${search}%` },
        };
      }
      const pager = new Pagination(page);
      const { rows, count } = await Stock.findAndCountAll({
        where: query,
        offset: pager.startIndex,
        limit: pager.pageSize,
        order: [["name", "ASC"]],
        include: [Cart],
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

  async updateStock(data: StockAttributes) {
    const feedback = new Feedback<Stock>();

    try {
      await Stock.update(
        {
          name: data.name,
        },
        { where: { id: data.id } }
      );
      feedback.data = (await Stock.findByPk(data.id)) as Stock;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.updateMessage;
      console.debug(error);
    }
    return feedback;
  }

  async deleteStock(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Stock.destroy({ where: { id } });
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
