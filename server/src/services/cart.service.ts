import UserDTO from "../models/DTO/UserDTO";
import Cart, { CartAttributes, CartCreationAttributes } from "../models/cart";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Stock from "../models/stock";
import User, { UserAttributes } from "../models/user";

export default class CartService {
  async createCart(data: CartCreationAttributes, user: UserAttributes) {
    const feedback = new Feedback<Cart>();

    try {
      const { id } = await Cart.create({
        quantity: data.quantity,
        stockId: data.stockId,
        userId: user.id,
      });
      feedback.data = (await Cart.findByPk(id, {
        include: [Stock, { model: User, attributes: UserDTO }],
      })) as Cart;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async updateCart(data: CartAttributes) {
    const feedback = new Feedback<boolean>();

    try {
      const [affectedCount] = await Cart.update(
        {
          quantity: data.quantity,
        },
        {
          where: { id: data.id },
        }
      );
      feedback.data = affectedCount > 0;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.updateMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getCartItems(page = 1, user: User) {
    const feedback = new Feedback<Cart>();

    try {
      const pager = new Pagination(page);
      const { count, rows } = await Cart.findAndCountAll({
        offset: pager.startIndex,
        limit: pager.pageSize,
        where: {
          userId: user.id,
        },
        include: [Stock],
      });
      feedback.results = rows;
      feedback.page = pager.page;
      feedback.totalPages = pager.totalPages(count);
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getCartItemsCount(user: User) {
    const feedback = new Feedback<number>();

    try {
      feedback.data = await Cart.count({
        where: {
          userId: user.id,
        },
      });
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
      console.debug(error);
    }
    return feedback;
  }

  async deleteCartItem(id: number) {
    const feedback = new Feedback<boolean>();

    try {
      const result = await Cart.destroy({ where: { id } });
      feedback.data = result > 0;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.deleteMessage;
      console.log(error);
    }
    return feedback;
  }
}
