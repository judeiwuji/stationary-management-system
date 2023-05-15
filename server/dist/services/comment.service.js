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
const errors_1 = __importDefault(require("../models/errors"));
const feedback_1 = __importDefault(require("../models/feedback"));
const pagination_1 = __importDefault(require("../models/pagination"));
const comment_1 = __importDefault(require("../models/comment"));
const user_1 = __importDefault(require("../models/user"));
const UserDTO_1 = __importDefault(require("../models/DTO/UserDTO"));
class CommentService {
    createComment(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const { id } = yield comment_1.default.create({
                    content: data.content,
                    requisitionId: data.requisitionId,
                    userId: user.id,
                }, { include: [{ model: user_1.default, attributes: UserDTO_1.default }] });
                feedback.data = (yield comment_1.default.findByPk(id, {
                    include: [{ model: user_1.default, attributes: UserDTO_1.default }],
                }));
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.createMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    updateComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                yield comment_1.default.update({ content: data.content }, { where: { id: data.id } });
                feedback.data = (yield comment_1.default.findByPk(data.id, {
                    include: [{ model: user_1.default, attributes: UserDTO_1.default }],
                }));
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.createMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    getComments(page = 1, requisitionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const pager = new pagination_1.default(page);
                const { rows, count } = yield comment_1.default.findAndCountAll({
                    where: { requisitionId },
                    offset: pager.startIndex,
                    limit: pager.pageSize,
                    order: [["createdAt", "DESC"]],
                    include: [{ model: user_1.default, attributes: UserDTO_1.default }],
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
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const result = yield comment_1.default.destroy({ where: { id } });
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
exports.default = CommentService;
//# sourceMappingURL=comment.service.js.map