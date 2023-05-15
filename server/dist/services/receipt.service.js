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
const errors_1 = __importDefault(require("../models/errors"));
const feedback_1 = __importDefault(require("../models/feedback"));
const pagination_1 = __importDefault(require("../models/pagination"));
const receipt_1 = __importDefault(require("../models/receipt"));
const UserDTO_1 = __importDefault(require("../models/DTO/UserDTO"));
const user_1 = __importDefault(require("../models/user"));
const requisition_item_1 = __importDefault(require("../models/requisition_item"));
const sequelize_2 = __importDefault(require("../models/engine/sequelize"));
const stock_1 = __importDefault(require("../models/stock"));
class ReceiptService {
    createReceipt(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_2.default.transaction();
            try {
                const requisitionItem = yield requisition_item_1.default.findByPk(data.requisitionItemId, { include: [stock_1.default] });
                if (!requisitionItem) {
                    feedback.success = false;
                    feedback.message = "Item not found";
                    transaction.rollback();
                    return feedback;
                }
                requisitionItem.stock.quantity += requisitionItem.quantity;
                requisitionItem.stock.save({ transaction });
                feedback.data = yield receipt_1.default.create({
                    image: data.image,
                    requisitionItemId: data.requisitionItemId,
                    userId: user.id,
                }, { transaction });
                yield transaction.commit();
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
    getReceipts(page = 1, search, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const pager = new pagination_1.default(page);
                let query = {};
                query = search
                    ? {
                        [sequelize_1.Op.or]: [{ name: { [sequelize_1.Op.like]: `%${search}%` } }],
                    }
                    : query;
                const { count, rows } = yield receipt_1.default.findAndCountAll({
                    where: query,
                    offset: pager.startIndex,
                    limit: pager.pageSize,
                    order: [["createdAt", "DESC"]],
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        { model: requisition_item_1.default, include: [stock_1.default] },
                    ],
                    attributes: [
                        "id",
                        "requisitionItemId",
                        "userId",
                        "image",
                        "createdAt",
                        "UpdatedAt",
                        [sequelize_2.default.cast(sequelize_2.default.where(sequelize_2.default.col("userId"), user.id), "int"), "isOwner"],
                    ],
                });
                feedback.results = rows;
                feedback.page = page;
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
    deleteReceipt(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const result = yield receipt_1.default.destroy({ where: { id } });
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
}
exports.default = ReceiptService;
//# sourceMappingURL=receipt.service.js.map