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
const sequelize_1 = require("sequelize");
const UserDTO_1 = __importDefault(require("../models/DTO/UserDTO"));
const comment_1 = __importDefault(require("../models/comment"));
const department_1 = __importDefault(require("../models/department"));
const sequelize_2 = __importDefault(require("../models/engine/sequelize"));
const errors_1 = __importDefault(require("../models/errors"));
const feedback_1 = __importDefault(require("../models/feedback"));
const pagination_1 = __importDefault(require("../models/pagination"));
const receipt_1 = __importDefault(require("../models/receipt"));
const requisition_1 = __importDefault(require("../models/requisition"));
const requisition_status_1 = require("../models/requisition-status");
const requisition_item_1 = __importDefault(require("../models/requisition_item"));
const role_1 = require("../models/role");
const stock_1 = __importDefault(require("../models/stock"));
const user_1 = __importDefault(require("../models/user"));
class RequisitionService {
    createRequisition(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_2.default.transaction();
            try {
                const requisition = yield requisition_1.default.create({
                    description: data.description,
                    destination: data.destination,
                    through: data.through,
                    sourceId: data.sourceId,
                    status: requisition_status_1.RequisitionStatus.PENDING,
                    userId: user.id,
                }, { transaction });
                const items = data.items
                    ? data.items.map((d) => ({
                        price: d.price,
                        quantity: d.quantity,
                        requisitionId: requisition.id,
                        stockId: d.stockId,
                    }))
                    : [];
                yield requisition_item_1.default.bulkCreate(items, { transaction });
                transaction.commit();
                feedback.data = (yield requisition_1.default.findByPk(requisition.id, {
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        {
                            model: requisition_item_1.default,
                            include: [{ model: stock_1.default, attributes: ["name"] }],
                        },
                        {
                            model: department_1.default,
                            attributes: ["name"],
                        },
                        { model: comment_1.default, limit: 15, order: [["createdAt", "DESC"]] },
                    ],
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
    getRequisitions(page = 1, filters, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                let query = {};
                query = filters ? Object.assign(Object.assign({}, filters), query) : query;
                if (user.role === role_1.Roles.HOD || user.role === role_1.Roles.STOCK_MANAGER) {
                    query = Object.assign(Object.assign({}, query), { userId: user.id });
                }
                const pager = new pagination_1.default(page);
                feedback.results = yield requisition_1.default.findAll({
                    where: query,
                    attributes: [
                        "id",
                        "userId",
                        "sourceId",
                        "through",
                        "destination",
                        "description",
                        "status",
                        "createdAt",
                        [
                            sequelize_2.default.cast(sequelize_2.default.where(sequelize_2.default.col("Requisition.userId"), user.id), "int"),
                            "isOwner",
                        ],
                        [sequelize_2.default.literal(`${user.role === role_1.Roles.AUDITOR}`), "isAuditor"],
                        [sequelize_2.default.literal(`${user.role === role_1.Roles.BURSAR}`), "isBursar"],
                        [sequelize_2.default.literal(`${user.role === role_1.Roles.RECTOR}`), "isRector"],
                        [
                            sequelize_2.default.cast(sequelize_2.default.literal(`${role_1.Roles.PURCHASE_OFFICIER === user.role}`), "int"),
                            "isPurchaseOfficier",
                        ],
                        [
                            sequelize_2.default.literal(`${user.role === role_1.Roles.STOCK_MANAGER}`),
                            "isStockManager",
                        ],
                    ],
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        {
                            model: requisition_item_1.default,
                            include: [{ model: stock_1.default, attributes: ["name"] }, receipt_1.default],
                            required: true,
                        },
                        {
                            model: department_1.default,
                            attributes: ["name"],
                        },
                    ],
                    offset: pager.startIndex,
                    limit: pager.pageSize,
                    order: [["createdAt", "DESC"]],
                });
                feedback.totalPages = pager.totalPages(yield requisition_1.default.count({ where: query }));
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
    getRequisition(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                feedback.data = (yield requisition_1.default.findByPk(id, {
                    attributes: [
                        "id",
                        "userId",
                        "sourceId",
                        "through",
                        "destination",
                        "description",
                        "status",
                        "createdAt",
                        [
                            sequelize_2.default.cast(sequelize_2.default.where(sequelize_2.default.col("Requisition.userId"), user.id), "int"),
                            "isOwner",
                        ],
                        [sequelize_2.default.literal(`${user.role === role_1.Roles.BURSAR}`), "isBursar"],
                        [sequelize_2.default.literal(`${user.role === role_1.Roles.AUDITOR}`), "isAuditor"],
                        [sequelize_2.default.literal(`${user.role === role_1.Roles.RECTOR}`), "isRector"],
                        [
                            sequelize_2.default.cast(sequelize_2.default.literal(`${role_1.Roles.PURCHASE_OFFICIER === user.role}`), "int"),
                            "isPurchaseOfficier",
                        ],
                        [
                            sequelize_2.default.literal(`${user.role === role_1.Roles.STOCK_MANAGER}`),
                            "isStockManager",
                        ],
                    ],
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        {
                            model: requisition_item_1.default,
                            include: [
                                { model: stock_1.default, attributes: ["name"] },
                                { model: receipt_1.default },
                            ],
                        },
                        {
                            model: department_1.default,
                            attributes: ["name"],
                        },
                    ],
                }));
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.getMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    updateRequisition(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                yield requisition_1.default.update({
                    description: data.description,
                    destination: data.destination,
                    through: data.through,
                    sourceId: data.sourceId,
                    status: data.status,
                }, { where: { id: data.id } });
                feedback.data = yield requisition_1.default.findByPk(data.id, {
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        {
                            model: requisition_item_1.default,
                            include: [{ model: stock_1.default, attributes: ["name"] }],
                        },
                        {
                            model: department_1.default,
                            attributes: ["name"],
                        },
                        { model: comment_1.default, limit: 15, order: [["createdAt", "DESC"]] },
                    ],
                });
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.updateMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    deleteRequisition(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const result = yield requisition_1.default.destroy({ where: { id } });
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
    addRequisitionItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const { id } = yield requisition_item_1.default.create({
                    price: data.price,
                    quantity: data.quantity,
                    stockId: data.stockId,
                    requisitionId: data.requisitionId,
                }, { include: [{ model: stock_1.default, attributes: ["name"] }] });
                feedback.data = (yield requisition_item_1.default.findByPk(id, {
                    include: [{ model: stock_1.default, attributes: ["name"] }],
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
    deleteRequisitionItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const result = yield requisition_item_1.default.destroy({ where: { id } });
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
    getRequisitionsReport(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const today = new Date();
                const year = today.getFullYear();
                console.log(today.getMonth());
                const month = today.getMonth() + 1;
                const totalDays = new Date(year, month, 0).getDate();
                const monthStart = new Date(`${year}-${month}-1 00:00:00`);
                const monthEnd = new Date(`${year}-${month}-${totalDays} 23:00:00`);
                console.log(year, month, totalDays);
                console.log(monthEnd);
                let query = {
                    userId: user.id,
                    createdAt: {
                        [sequelize_1.Op.and]: [{ [sequelize_1.Op.gte]: monthStart }, { [sequelize_1.Op.lte]: monthEnd }],
                    },
                };
                feedback.results = yield requisition_1.default.count({
                    attributes: ["status", "createdAt"],
                    group: ["status"],
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
exports.default = RequisitionService;
//# sourceMappingURL=requisition.service.js.map