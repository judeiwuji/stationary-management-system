import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Comment, {
  CommentAttributes,
  CommentCreationAttributes,
} from "../models/comment";
import User from "../models/user";
import UserDTO from "../models/DTO/UserDTO";
import Order, { OrderCreationAttributes } from "../models/order";
import db from "../models/engine/sequelize";
import OrderItem, { OrderItemCreationAttributes } from "../models/order_item";
import Requisition from "../models/requisition";
import Stock from "../models/stock";
import { RequisitionStatus } from "../models/requisition-status";

export default class OrderService {
  async createOrder(data: OrderCreationAttributes, user: User) {
    const feedback = new Feedback<Order>();
    const transaction = await db.transaction();

    try {
      const { id } = await Order.create(
        {
          requisitionId: data.requisitionId,
          userId: user.id,
        },
        { transaction }
      );

      if (data.requisitionItems) {
        const items: OrderItemCreationAttributes[] = data.requisitionItems.map(
          (d) => ({
            orderId: id,
            quantity: d.quantity,
            stockId: d.stockId,
            subTotal: Number(d.price) * d.quantity,
          })
        );
        for (const d of items) {
          const stock = await Stock.findByPk(d.stockId, { transaction });
          if (stock) {
            stock.quantity -= d.quantity;
            await stock.save({ transaction });
          }
        }
        await OrderItem.bulkCreate(items, { transaction });
        await Requisition.update(
          { status: RequisitionStatus.COMPLETED },
          { where: { id: data.requisitionId } }
        );
      }
      await transaction.commit();
      feedback.data = (await Order.findByPk(id, {
        include: [OrderItem, { model: User, attributes: UserDTO }],
      })) as Order;
    } catch (error) {
      await transaction.rollback();
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getOrders(page = 1) {
    const feedback = new Feedback<Order>();

    try {
      const pager = new Pagination(page);

      const { rows, count } = await Order.findAndCountAll({
        offset: pager.startIndex,
        limit: pager.pageSize,
        order: [["createdAt", "DESC"]],
        include: [{ model: User, attributes: UserDTO }, OrderItem],
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

  async deleteOrder(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Order.destroy({ where: { id } });
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
