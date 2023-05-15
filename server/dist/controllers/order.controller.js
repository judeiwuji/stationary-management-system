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
const order_service_1 = __importDefault(require("../services/order.service"));
const order_schema_1 = require("../validators/schema/order.schema");
class OrderController {
    constructor() {
        this.orderService = new order_service_1.default();
    }
    createRequisitionOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(order_schema_1.OrderCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.orderService.createRequisitionOrder(validation.data, req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.status(201).send(feedback);
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = yield this.orderService.createOrder(req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.status(201).send(feedback);
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(order_schema_1.OrderUpdateSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.orderService.updateOrder(validation.data);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.send(feedback);
        });
    }
    getOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.query.page) || 1;
            const filters = req.query.filters;
            const feedback = yield this.orderService.getOrders(page, filters ? JSON.parse(filters) : {}, req.user);
            res.send(feedback);
        });
    }
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(400).send("id is required");
            }
            const feedback = yield this.orderService.deleteOrder(Number(id));
            if (!feedback.success) {
                return res.status(404).send(feedback.message);
            }
            res.send(feedback);
        });
    }
    getOrdersReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = yield this.orderService.getOrdersReport(req.user);
            res.send(feedback);
        });
    }
}
exports.default = OrderController;
//# sourceMappingURL=order.controller.js.map