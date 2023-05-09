import { Response } from "express";
import IRequest from "../models/interfaces/irequest";
import CartService from "../services/cart.service";
import validate from "../validators/validate";
import {
  CartCreationSchema,
  CartUpdateSchema,
} from "../validators/schema/cart.schema";
import { CartAttributes, CartCreationAttributes } from "../models/cart";
import User from "../models/user";

export default class CartController {
  cartService = new CartService();

  async createCart(req: IRequest, res: Response) {
    const validation = await validate<CartCreationAttributes>(
      CartCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }

    const feedback = await this.cartService.createCart(
      validation.data,
      req.user as User
    );

    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.status(201).send(feedback);
  }

  async updateCart(req: IRequest, res: Response) {
    const validation = await validate<CartAttributes>(
      CartUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }

    const feedback = await this.cartService.updateCart(validation.data);

    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    return res.send(feedback);
  }

  async getCartItems(req: IRequest, res: Response) {
    const page = Number(req.query.page) || 1;

    const feedback = await this.cartService.getCartItems(
      page,
      req.user as User
    );
    return res.send(feedback);
  }

  async getCartItemsCount(req: IRequest, res: Response) {
    const feedback = await this.cartService.getCartItemsCount(req.user as User);
    return res.send(feedback);
  }

  async deleteCartItems(req: IRequest, res: Response) {
    const { id } = req.params;

    const feedback = await this.cartService.deleteCartItem(Number(id));
    return res.send(feedback);
  }
}
