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
const requisition_schema_1 = require("../validators/schema/requisition.schema");
const requisition_service_1 = __importDefault(require("../services/requisition.service"));
class RequisitionController {
    constructor() {
        this.requisitionService = new requisition_service_1.default();
    }
    createRequisition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(requisition_schema_1.RequisitionCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.requisitionService.createRequisition(validation.data, req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.status(201).send(feedback);
        });
    }
    getRequisitions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = req.query.filters;
            const page = Number(req.query.page) || 1;
            const feedback = yield this.requisitionService.getRequisitions(page, filters ? JSON.parse(filters) : "", req.user);
            res.send(feedback);
        });
    }
    getRequisition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const feedback = yield this.requisitionService.getRequisition(Number(id), req.user);
            res.send(feedback);
        });
    }
    updateRequisition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(requisition_schema_1.RequisitionUpdateSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.requisitionService.updateRequisition(validation.data);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.send(feedback);
        });
    }
    deleteRequisition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).send("id is required");
            }
            const feedback = yield this.requisitionService.deleteRequisition(Number(id));
            if (!feedback.success) {
                return res.status(404).send(feedback.message);
            }
            return res.send(feedback);
        });
    }
    addRequisitionItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(requisition_schema_1.RequisitionItemCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.requisitionService.addRequisitionItem(validation.data);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.status(201).send(feedback);
        });
    }
    deleteRequisitionItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).send("id is required");
            }
            const feedback = yield this.requisitionService.deleteRequisitionItem(Number(id));
            if (!feedback.success) {
                return res.status(404).send(feedback.message);
            }
            return res.send(feedback);
        });
    }
    getRequisitionReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = yield this.requisitionService.getRequisitionsReport(req.user);
            res.send(feedback);
        });
    }
}
exports.default = RequisitionController;
//# sourceMappingURL=requisition.controller.js.map