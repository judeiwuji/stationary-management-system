"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_controller_1 = __importDefault(require("../controllers/cart.controller"));
class CartRoute {
    constructor(app) {
        this.app = app;
        this.cartController = new cart_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/cart", (req, res) => this.cartController.createCart(req, res));
        this.app.get("/api/cart", (req, res) => this.cartController.getCartItems(req, res));
        this.app.get("/api/cart/count", (req, res) => this.cartController.getCartItemsCount(req, res));
        this.app.put("/api/cart", (req, res) => this.cartController.updateCart(req, res));
        this.app.delete("/api/cart/:id", (req, res) => this.cartController.deleteCartItems(req, res));
    }
}
exports.default = CartRoute;
//# sourceMappingURL=cart.route.js.map