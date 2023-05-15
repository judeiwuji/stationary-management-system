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
const comment_service_1 = __importDefault(require("../services/comment.service"));
const comment_schema_1 = require("../validators/schema/comment.schema");
class CommentController {
    constructor() {
        this.commentService = new comment_service_1.default();
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const validation = yield (0, validate_1.default)(comment_schema_1.CommentCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            validation.data.requisitionId = Number(id);
            console.log(req.user);
            const feedback = yield this.commentService.createComment(validation.data, req.user);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.status(201).send(feedback);
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const page = Number(req.query.page) || 1;
            const feedback = yield this.commentService.getComments(page, Number(id));
            res.send(feedback);
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(comment_schema_1.CommentUpdateSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.commentService.updateComment(validation.data);
            res.send(feedback);
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(400).send("id is required");
            }
            const feedback = yield this.commentService.deleteComment(Number(id));
            if (!feedback.success) {
                return res.status(404).send(feedback.message);
            }
            res.send(feedback);
        });
    }
}
exports.default = CommentController;
//# sourceMappingURL=comment.controller.js.map