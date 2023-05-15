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
const inbox_schema_1 = require("../validators/schema/inbox.schema");
const validate_1 = __importDefault(require("../validators/validate"));
const message_service_1 = __importDefault(require("../services/message.service"));
class MessageController {
    constructor() {
        this.messageService = new message_service_1.default();
    }
    createMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const inboxId = Number(req.params.id);
            const validation = yield (0, validate_1.default)(inbox_schema_1.MessageCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            let feedback;
            if (inboxId === 0) {
                feedback = yield this.messageService.createNewMessage(validation.data, req.user);
            }
            else {
                feedback = yield this.messageService.createMessage(validation.data, Number(inboxId), req.user);
            }
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.status(201).send(feedback);
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.query.page) || 1;
            const inboxId = req.params.id;
            const feedback = yield this.messageService.getMessages(page, Number(inboxId), req.user);
            res.send(feedback);
        });
    }
    updateMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const inboxId = req.params.id;
            const validation = yield (0, validate_1.default)(inbox_schema_1.MessageUpdateSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.messageService.updateMessage(validation.data, Number(inboxId));
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.send(feedback);
        });
    }
    countUnReadMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = yield this.messageService.countUnreadMessages(req.user);
            res.send(feedback);
        });
    }
}
exports.default = MessageController;
//# sourceMappingURL=message.controller.js.map