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
const UserDTO_1 = __importDefault(require("../models/DTO/UserDTO"));
const cart_1 = __importDefault(require("../models/cart"));
const errors_1 = __importDefault(require("../models/errors"));
const feedback_1 = __importDefault(require("../models/feedback"));
const pagination_1 = __importDefault(require("../models/pagination"));
const stock_1 = __importDefault(require("../models/stock"));
const user_1 = __importDefault(require("../models/user"));
class CartService {
    createCart(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const { id } = yield cart_1.default.create({
                    quantity: data.quantity,
                    stockId: data.stockId,
                    userId: user.id,
                });
                feedback.data = (yield cart_1.default.findByPk(id, {
                    include: [stock_1.default, { model: user_1.default, attributes: UserDTO_1.default }],
                }));
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.createMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    updateCart(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const [affectedCount] = yield cart_1.default.update({
                    quantity: data.quantity,
                }, {
                    where: { id: data.id },
                });
                feedback.data = affectedCount > 0;
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.updateMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    getCartItems(page = 1, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const pager = new pagination_1.default(page);
                const { count, rows } = yield cart_1.default.findAndCountAll({
                    offset: pager.startIndex,
                    limit: pager.pageSize,
                    where: {
                        userId: user.id,
                    },
                    include: [stock_1.default],
                });
                feedback.results = rows;
                feedback.page = pager.page;
                feedback.totalPages = pager.totalPages(count);
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.getMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    getCartItemsCount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                feedback.data = yield cart_1.default.count({
                    where: {
                        userId: user.id,
                    },
                });
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.getMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    deleteCartItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const result = yield cart_1.default.destroy({ where: { id } });
                feedback.data = result > 0;
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.deleteMessage;
                console.log(error);
            }
            return feedback;
        });
    }
}
exports.default = CartService;
//# sourceMappingURL=cart.service.js.map