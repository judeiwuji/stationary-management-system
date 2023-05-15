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
const validate_1 = __importDefault(require("../validators/validate"));
const stock_service_1 = __importDefault(require("../services/stock.service"));
const stock_schema_1 = require("../validators/schema/stock.schema");
class StockController {
    constructor() {
        this.stockService = new stock_service_1.default();
    }
    createStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(stock_schema_1.StockCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.stockService.createStock(validation.data, req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.status(201).send(feedback);
        });
    }
    getStocks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const search = req.query.search;
            const page = Number(req.query.page) || 1;
            const filters = req.query.filters;
            const feedback = yield this.stockService.getStocks(page, search, filters ? JSON.parse(filters) : "");
            res.send(feedback);
        });
    }
    updateStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(stock_schema_1.StockUpdateSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.stockService.updateStock(validation.data);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.send(feedback);
        });
    }
    deleteStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(400).send("id is required");
            }
            const feedback = yield this.stockService.deleteStock(Number(id));
            if (!feedback.success) {
                return res.status(404).send(feedback.message);
            }
            res.send(feedback);
        });
    }
}
exports.default = StockController;
//# sourceMappingURL=stock.controller.js.map