import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import CartController from "../controllers/cart.controller";

export default class CartRoute implements IRoute {
  cartController = new CartController();

  constructor(private app: Application) {
    this.routes();
  }
  routes(): void {
    this.app.post("/api/cart", (req, res) =>
      this.cartController.createCart(req, res)
    );

    this.app.get("/api/cart", (req, res) =>
      this.cartController.getCartItems(req, res)
    );

    this.app.get("/api/cart/count", (req, res) =>
      this.cartController.getCartItemsCount(req, res)
    );

    this.app.put("/api/cart", (req, res) =>
      this.cartController.updateCart(req, res)
    );

    this.app.delete("/api/cart/:id", (req, res) =>
      this.cartController.deleteCartItems(req, res)
    );
  }
}
