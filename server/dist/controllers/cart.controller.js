"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_service_1 = __importDefault(require("../services/cart.service"));
const validate_1 = __importDefault(require("../validators/validate"));
const cart_schema_1 = require("../validators/schema/cart.schema");
class CartController {
    constructor() {
        this.cartService = new cart_service_1.default();
    }
    createCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(cart_schema_1.CartCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.cartService.createCart(validation.data, req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.status(201).send(feedback);
        });
    }
    updateCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(cart_schema_1.CartUpdateSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.cartService.updateCart(validation.data);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.send(feedback);
        });
    }
    getCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.query.page) || 1;
            const feedback = yield this.cartService.getCartItems(page, req.user);
            return res.send(feedback);
        });
    }
    getCartItemsCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = yield this.cartService.getCartItemsCount(req.user);
            return res.send(feedback);
        });
    }
    deleteCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const feedback = yield this.cartService.deleteCartItem(Number(id));
            return res.send(feedback);
        });
    }
}
exports.default = CartController;
//# sourceMappingURL=cart.controller.js.map