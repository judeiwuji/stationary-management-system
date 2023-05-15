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
const inbox_schema_1 = require("../validators/schema/inbox.schema");
const inbox_service_1 = __importDefault(require("../services/inbox.service"));
class InboxController {
    constructor() {
        this.inboxService = new inbox_service_1.default();
    }
    createInbox(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(inbox_schema_1.InboxSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.inboxService.createInbox(validation.data, req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.status(201).send(feedback);
        });
    }
    getAllInbox(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.query.page) || 1;
            const feedback = yield this.inboxService.getInboxes(page, req.user);
            res.send(feedback);
        });
    }
    getInbox(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const otherId = Number(req.params.id);
            const feedback = yield this.inboxService.getInbox(otherId, req.user);
            res.send(feedback);
        });
    }
    hasNewInboxMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { timestamp } = req.query;
            const feedback = yield this.inboxService.hasNewInboxMessages(req.user, new Date(Number(timestamp)));
            res.send(feedback);
        });
    }
}
exports.default = InboxController;
//# sourceMappingURL=inbox.controller.js.map