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
const receipt_service_1 = __importDefault(require("../services/receipt.service"));
const receipt_schema_1 = require("../validators/schema/receipt.schema");
class ReceiptController {
    constructor() {
        this.receiptService = new receipt_service_1.default();
    }
    createReceipt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.file);
            if (!req.file) {
                return res.status(400).send("receipt is required");
            }
            const validation = yield (0, validate_1.default)(receipt_schema_1.ReceiptCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            validation.data.image = req.file.path;
            const feedback = yield this.receiptService.createReceipt(validation.data, req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.status(201).send(feedback);
        });
    }
    getReceipts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const search = req.query.search;
            const page = Number(req.query.page) || 1;
            const feedback = yield this.receiptService.getReceipts(page, search, req.user);
            res.send(feedback);
        });
    }
    deleteReceipt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(400).send("id is required");
            }
            const feedback = yield this.receiptService.deleteReceipt(Number(id));
            if (!feedback.success) {
                return res.status(404).send(feedback.message);
            }
            res.send(feedback);
        });
    }
}
exports.default = ReceiptController;
//# sourceMappingURL=receipt.controller.js.map