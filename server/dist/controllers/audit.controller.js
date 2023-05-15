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
const audit_service_1 = __importDefault(require("../services/audit.service"));
const audit_schema_1 = require("../validators/schema/audit.schema");
const validate_1 = __importDefault(require("../validators/validate"));
class AuditController {
    constructor() {
        this.auditService = new audit_service_1.default();
    }
    createAudit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(audit_schema_1.AuditCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.auditService.createAudit(validation.data, req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.status(201).send(feedback);
        });
    }
    getAudits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = req.query.filters;
            const page = Number(req.query.page) || 1;
            const feedback = yield this.auditService.getAudits(page, filters ? JSON.parse(filters) : "", req.user);
            res.send(feedback);
        });
    }
    updateAudit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(audit_schema_1.AuditUpdateSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.auditService.updateAudit(validation.data);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.send(feedback);
        });
    }
    deleteAudit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).send("id is required");
            }
            const feedback = yield this.auditService.deleteAudit(Number(id));
            if (!feedback.success) {
                return res.status(404).send(feedback.message);
            }
            return res.send(feedback);
        });
    }
}
exports.default = AuditController;
//# sourceMappingURL=audit.controller.js.map