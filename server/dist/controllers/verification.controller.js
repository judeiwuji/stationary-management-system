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
const verification_service_1 = __importDefault(require("../services/verification.service"));
const verification_schema_1 = require("../validators/schema/verification.schema");
const validate_1 = __importDefault(require("../validators/validate"));
class VerificationController {
    constructor() {
        this.verifyService = new verification_service_1.default();
    }
    createVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(verification_schema_1.VerificationCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.verifyService.createVerification(validation.data, req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.status(201).send(feedback);
        });
    }
    getVerifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = req.query.filters;
            const page = Number(req.query.page) || 1;
            const feedback = yield this.verifyService.getVerifications(page, filters ? JSON.parse(filters) : "", req.user);
            res.send(feedback);
        });
    }
    updateVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(verification_schema_1.VerificationUpdateSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.verifyService.updateVerification(validation.data);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            return res.send(feedback);
        });
    }
    deleteVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).send("id is required");
            }
            const feedback = yield this.verifyService.deleteVerification(Number(id));
            if (!feedback.success) {
                return res.status(404).send(feedback.message);
            }
            return res.send(feedback);
        });
    }
}
exports.default = VerificationController;
//# sourceMappingURL=verification.controller.js.map