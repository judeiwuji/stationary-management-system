import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import User from "../models/user";
import UserDTO from "../models/DTO/UserDTO";
import Order, {
  OrderAttributes,
  OrderCreationAttributes,
} from "../models/order";
import db from "../models/engine/sequelize";
import OrderItem, { OrderItemCreationAttributes } from "../models/order_item";
import Requisition from "../models/requisition";
import Stock from "../models/stock";
import { RequisitionStatus } from "../models/requisition-status";
import { OrderStatus } from "../models/order_status";
import { Roles } from "../models/role";
import { Op } from "sequelize";
import Cart from "../models/cart";

export default class OrderService {
  async createRequisitionOrder(data: OrderCreationAttributes, user: User) {
    const feedback = new Feedback<Order>();
    const transaction = await db.transaction();

    try {
      const { id } = await Order.create(
        {
          requisitionId: data.requisitionId,
          userId: user.id,
          status: OrderStatus.PENDING,
        },
        { transaction }
      );

      if (data.requisitionItems) {
        const items: OrderItemCreationAttributes[] = data.requisitionItems.map(
          (d) => ({
            orderId: id,
            quantity: d.quantity,
            stockId: d.stockId,
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
          { status: RequisitionStatus.ORDERED },
          { where: { id: data.requisitionId }, transaction }
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

  async createOrder(user: User) {
    const feedback = new Feedback<Order>();
    const transaction = await db.transaction();

    try {
      const { id } = await Order.create(
        {
          userId: user.id,
          status: OrderStatus.COMPLETED,
        },
        { transaction }
      );

      const cartItems = await Cart.findAll({
        where: {
          userId: user.id,
        },
        include: [Stock],
      });

      const items: OrderItemCreationAttributes[] = await Promise.all(
        cartItems.map(async (d) => {
          d.stock.quantity -= d.quantity;
          await d.stock.save({ transaction });
          await d.destroy({ transaction });
          return {
            orderId: id,
            quantity: d.quantity,
            stockId: d.stockId,
          };
        })
      );
      await OrderItem.bulkCreate(items, { transaction });
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

  async getOrders(page = 1, filters: any, user: User) {
    const feedback = new Feedback<Order>();

    try {
      const query = filters ? { ...filters } : {};
      const pager = new Pagination(page);

      const { rows, count } = await Order.findAndCountAll({
        where: query,
        offset: pager.startIndex,
        limit: pager.pageSize,
        order: [["createdAt", "DESC"]],
        include: [
          { model: User, attributes: UserDTO },
          { model: OrderItem, include: [Stock] },
        ],
        attributes: [
          "id",
          "userId",
          "requisitionId",
          "status",
          "createdAt",
          "updatedAt",
          [db.cast(db.where(db.col("userId"), user.id), "int"), "isOwner"],
          [
            db.literal(`${user.role === Roles.STOCK_MANAGER}`),
            "isStockManager",
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

  async updateOrder(order: OrderAttributes) {
    const feedback = new Feedback<boolean>();
    const transaction = await db.transaction();
    try {
      const [affectedCount] = await Order.update(
        { status: order.status },
        { where: { id: order.id }, transaction }
      );

      feedback.data = affectedCount > 0;
      if (affectedCount > 0 && order.status === OrderStatus.COMPLETED) {
        await Requisition.update(
          { status: RequisitionStatus.COMPLETED },
          {
            where: {
              id: order.requisitionId,
            },
            transaction,
          }
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      feedback.success = false;
      feedback.message = Errors.updateMessage;
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

  async getOrdersReport(user: User) {
    const feedback = new Feedback<any>();
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const totalDays = new Date(year, month, 0).getDate();
      const monthStart = new Date(`${year}-${month}-1 00:00:00`);
      const monthEnd = new Date(`${year}-${month}-${totalDays} 23:00:00`);

      let query: any = {
        createdAt: {
          [Op.and]: [{ [Op.gte]: monthStart }, { [Op.lte]: monthEnd }],
        },
      };

      // if (user.role === Roles.HOD) {
      //   query = { ...query, userId: user.id };
      // }
      feedback.results = await OrderItem.count({
        attributes: [
          "createdAt",
          [db.fn("sum", db.col("subTotal")), "totalAmount"],
        ],
        group: ["createdAt"],
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
