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
const stock_1 = __importDefault(require("../models/stock"));
const cart_1 = __importDefault(require("../models/cart"));
class StockService {
    createStock(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                feedback.data = yield stock_1.default.create({
                    quantity: 0,
                    name: data.name,
                });
            }
            catch (error) {
                console.log(error.name);
                if (error.name === "SequelizeUniqueConstraintError") {
                    feedback.message = "Stock already exists";
                }
                else {
                    feedback.message = errors_1.default.createMessage;
                }
                feedback.success = false;
                console.debug(error);
            }
            return feedback;
        });
    }
    getStocks(page = 1, search = "", filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                let query = {};
                query = filters ? Object.assign(Object.assign({}, filters), query) : query;
                if (search) {
                    query = Object.assign(Object.assign({}, query), { name: { [sequelize_1.Op.like]: `%${search}%` } });
                }
                const pager = new pagination_1.default(page);
                const { rows, count } = yield stock_1.default.findAndCountAll({
                    where: query,
                    offset: pager.startIndex,
                    limit: pager.pageSize,
                    order: [["name", "ASC"]],
                    include: [cart_1.default],
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
    updateStock(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                yield stock_1.default.update({
                    name: data.name,
                }, { where: { id: data.id } });
                feedback.data = (yield stock_1.default.findByPk(data.id));
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.updateMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    deleteStock(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const result = yield stock_1.default.destroy({ where: { id } });
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
exports.default = StockService;
//# sourceMappingURL=stock.service.js.map