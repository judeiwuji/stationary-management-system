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
const errors_1 = __importDefault(require("../models/errors"));
const feedback_1 = __importDefault(require("../models/feedback"));
const pagination_1 = __importDefault(require("../models/pagination"));
const user_1 = __importDefault(require("../models/user"));
const UserDTO_1 = __importDefault(require("../models/DTO/UserDTO"));
const order_1 = __importDefault(require("../models/order"));
const sequelize_1 = __importDefault(require("../models/engine/sequelize"));
const order_item_1 = __importDefault(require("../models/order_item"));
const requisition_1 = __importDefault(require("../models/requisition"));
const stock_1 = __importDefault(require("../models/stock"));
const requisition_status_1 = require("../models/requisition-status");
const order_status_1 = require("../models/order_status");
const role_1 = require("../models/role");
const sequelize_2 = require("sequelize");
const cart_1 = __importDefault(require("../models/cart"));
class OrderService {
    createRequisitionOrder(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_1.default.transaction();
            try {
                const { id } = yield order_1.default.create({
                    requisitionId: data.requisitionId,
                    userId: user.id,
                    status: order_status_1.OrderStatus.PENDING,
                }, { transaction });
                if (data.requisitionItems) {
                    const items = data.requisitionItems.map((d) => ({
                        orderId: id,
                        quantity: d.quantity,
                        stockId: d.stockId,
                    }));
                    for (const d of items) {
                        const stock = yield stock_1.default.findByPk(d.stockId, { transaction });
                        if (stock) {
                            stock.quantity -= d.quantity;
                            yield stock.save({ transaction });
                        }
                    }
                    yield order_item_1.default.bulkCreate(items, { transaction });
                    yield requisition_1.default.update({ status: requisition_status_1.RequisitionStatus.ORDERED }, { where: { id: data.requisitionId }, transaction });
                }
                yield transaction.commit();
                feedback.data = (yield order_1.default.findByPk(id, {
                    include: [order_item_1.default, { model: user_1.default, attributes: UserDTO_1.default }],
                }));
            }
            catch (error) {
                yield transaction.rollback();
                feedback.success = false;
                feedback.message = errors_1.default.createMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    createOrder(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_1.default.transaction();
            try {
                const { id } = yield order_1.default.create({
                    userId: user.id,
                    status: order_status_1.OrderStatus.COMPLETED,
                }, { transaction });
                const cartItems = yield cart_1.default.findAll({
                    where: {
                        userId: user.id,
                    },
                    include: [stock_1.default],
                });
                const items = yield Promise.all(cartItems.map((d) => __awaiter(this, void 0, void 0, function* () {
                    d.stock.quantity -= d.quantity;
                    yield d.stock.save({ transaction });
                    yield d.destroy({ transaction });
                    return {
                        orderId: id,
                        quantity: d.quantity,
                        stockId: d.stockId,
                    };
                })));
                yield order_item_1.default.bulkCreate(items, { transaction });
                yield transaction.commit();
                feedback.data = (yield order_1.default.findByPk(id, {
                    include: [order_item_1.default, { model: user_1.default, attributes: UserDTO_1.default }],
                }));
            }
            catch (error) {
                yield transaction.rollback();
                feedback.success = false;
                feedback.message = errors_1.default.createMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    getOrders(page = 1, filters, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                let query = filters ? Object.assign({}, filters) : {};
                const pager = new pagination_1.default(page);
                if (user.role === role_1.Roles.HOD) {
                    query = Object.assign(Object.assign({}, query), { userId: user.id });
                }
                const { rows, count } = yield order_1.default.findAndCountAll({
                    where: query,
                    offset: pager.startIndex,
                    limit: pager.pageSize,
                    order: [["createdAt", "DESC"]],
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        { model: order_item_1.default, include: [stock_1.default] },
                    ],
                    attributes: [
                        "id",
                        "userId",
                        "requisitionId",
                        "status",
                        "createdAt",
                        "updatedAt",
                        [sequelize_1.default.cast(sequelize_1.default.where(sequelize_1.default.col("userId"), user.id), "int"), "isOwner"],
                        [
                            sequelize_1.default.literal(`${user.role === role_1.Roles.STOCK_MANAGER}`),
                            "isStockManager",
                        ],
                    ],
                });
                feedback.results = rows;
                feedback.totalPages = pager.totalPages(count);
                feedback.page = page;
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.getMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    updateOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_1.default.transaction();
            try {
                const [affectedCount] = yield order_1.default.update({ status: order.status }, { where: { id: order.id }, transaction });
                feedback.data = affectedCount > 0;
                if (affectedCount > 0 && order.status === order_status_1.OrderStatus.COMPLETED) {
                    yield requisition_1.default.update({ status: requisition_status_1.RequisitionStatus.COMPLETED }, {
                        where: {
                            id: order.requisitionId,
                        },
                        transaction,
                    });
                }
                yield transaction.commit();
            }
            catch (error) {
                yield transaction.rollback();
                feedback.success = false;
                feedback.message = errors_1.default.updateMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const result = yield order_1.default.destroy({ where: { id } });
                if (result === 0) {
                    feedback.success = false;
                    feedback.message = "Not found";
                }
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.deleteMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    getOrdersReport(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth() + 1;
                const totalDays = new Date(year, month, 0).getDate();
                const monthStart = new Date(`${year}-${month}-1 00:00:00`);
                const monthEnd = new Date(`${year}-${month}-${totalDays} 23:00:00`);
                let query = {
                    createdAt: {
                        [sequelize_2.Op.and]: [{ [sequelize_2.Op.gte]: monthStart }, { [sequelize_2.Op.lte]: monthEnd }],
                    },
                };
                // if (user.role === Roles.HOD) {
                //   query = { ...query, userId: user.id };
                // }
                feedback.results = yield order_item_1.default.count({
                    attributes: [
                        "createdAt",
                        [sequelize_1.default.fn("sum", sequelize_1.default.col("subTotal")), "totalAmount"],
                    ],
                    group: ["createdAt"],
                    where: query,
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
}
exports.default = OrderService;
//# sourceMappingURL=order.service.js.map