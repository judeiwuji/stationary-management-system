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
const UserDTO_1 = __importDefault(require("../models/DTO/UserDTO"));
const sequelize_1 = __importDefault(require("../models/engine/sequelize"));
const errors_1 = __importDefault(require("../models/errors"));
const feedback_1 = __importDefault(require("../models/feedback"));
const message_1 = __importDefault(require("../models/message"));
const pagination_1 = __importDefault(require("../models/pagination"));
const user_1 = __importDefault(require("../models/user"));
const message_status_1 = require("../models/message_status");
const inbox_1 = __importDefault(require("../models/inbox"));
const sequelize_2 = require("sequelize");
class MessageService {
    createNewMessage(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_1.default.transaction();
            try {
                const inbox = yield inbox_1.default.create({ otherId: data.otherId, userId: user.id, messageAt: new Date() }, { transaction });
                yield inbox_1.default.create({
                    otherId: user.id,
                    userId: data.otherId,
                    inboxId: inbox.id,
                    messageAt: new Date(),
                }, { transaction });
                yield inbox_1.default.update({ inboxId: inbox.id }, { where: { id: inbox.id }, transaction });
                const message = yield message_1.default.create({
                    content: data.content,
                    inboxId: inbox.id,
                    status: message_status_1.MessageStatus.UNREAD,
                    userId: user.id,
                }, { transaction });
                feedback.data = (yield message_1.default.findByPk(message.id, {
                    attributes: [
                        "id",
                        "userId",
                        "inboxId",
                        "content",
                        "status",
                        [
                            sequelize_1.default.cast(sequelize_1.default.where(sequelize_1.default.col("Message.userId"), user.id), "int"),
                            "isOwner",
                        ],
                    ],
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        {
                            model: inbox_1.default,
                            include: [
                                { model: user_1.default, attributes: UserDTO_1.default, as: "other" },
                                { model: message_1.default, limit: 1 },
                            ],
                        },
                    ],
                    transaction,
                }));
                yield transaction.commit();
            }
            catch (error) {
                yield transaction.rollback();
                feedback.message = errors_1.default.createMessage;
                feedback.success = false;
                console.log(error);
            }
            return feedback;
        });
    }
    createMessage(data, inboxId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_1.default.transaction();
            try {
                const { id } = yield message_1.default.create({
                    content: data.content,
                    inboxId: inboxId,
                    status: message_status_1.MessageStatus.UNREAD,
                    userId: user.id,
                }, { transaction });
                yield inbox_1.default.update({ messageAt: new Date() }, {
                    where: {
                        inboxId,
                    },
                    transaction,
                });
                transaction.commit();
                feedback.data = (yield message_1.default.findByPk(id, {
                    attributes: [
                        "id",
                        "userId",
                        "inboxId",
                        "content",
                        "status",
                        [sequelize_1.default.cast(sequelize_1.default.where(sequelize_1.default.col("userId"), user.id), "int"), "isOwner"],
                    ],
                    include: [{ model: user_1.default, attributes: UserDTO_1.default }],
                }));
            }
            catch (error) {
                transaction.rollback();
                feedback.message = errors_1.default.createMessage;
                feedback.success = false;
                console.log(error);
            }
            return feedback;
        });
    }
    getMessages(page = 1, inboxId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const pager = new pagination_1.default(page);
                // Mark other inbox user messages as read
                yield message_1.default.update({ status: message_status_1.MessageStatus.READ }, {
                    where: {
                        inboxId,
                        userId: {
                            [sequelize_2.Op.ne]: user.id,
                        },
                    },
                });
                const { count, rows } = yield message_1.default.findAndCountAll({
                    where: { inboxId: inboxId },
                    offset: pager.startIndex,
                    limit: pager.pageSize,
                    order: [["createdAt", "DESC"]],
                    attributes: [
                        "id",
                        "userId",
                        "inboxId",
                        "content",
                        "status",
                        [sequelize_1.default.cast(sequelize_1.default.where(sequelize_1.default.col("userId"), user.id), "int"), "isOwner"],
                    ],
                    include: [{ model: user_1.default, attributes: UserDTO_1.default }],
                });
                feedback.results = rows;
                feedback.totalPages = pager.totalPages(count);
                feedback.page = pager.page;
            }
            catch (error) {
                feedback.message = errors_1.default.getMessage;
                feedback.success = false;
                console.debug(error);
            }
            return feedback;
        });
    }
    updateMessage(data, inboxId) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const [affectedCount] = yield message_1.default.update({ status: data.status, content: data.content }, { where: { inboxId } });
                feedback.data = affectedCount > 0;
            }
            catch (error) {
                feedback.message = errors_1.default.updateMessage;
                feedback.success = false;
                console.debug(feedback);
            }
            return feedback;
        });
    }
    countUnreadMessages(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const count = yield inbox_1.default.count({
                    where: { userId: user.id },
                    include: [
                        {
                            model: message_1.default,
                            where: {
                                status: message_status_1.MessageStatus.UNREAD,
                                userId: {
                                    [sequelize_2.Op.ne]: user.id,
                                },
                            },
                        },
                    ],
                });
                feedback.data = count;
            }
            catch (error) {
                feedback.message = errors_1.default.updateMessage;
                feedback.success = false;
                console.debug(feedback);
            }
            return feedback;
        });
    }
}
exports.default = MessageService;
//# sourceMappingURL=message.service.js.map