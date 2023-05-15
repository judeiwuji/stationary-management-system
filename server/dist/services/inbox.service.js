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
const inbox_1 = __importDefault(require("../models/inbox"));
const message_1 = __importDefault(require("../models/message"));
const pagination_1 = __importDefault(require("../models/pagination"));
const user_1 = __importDefault(require("../models/user"));
const UserDTO_1 = __importDefault(require("../models/DTO/UserDTO"));
const sequelize_1 = __importDefault(require("../models/engine/sequelize"));
const message_status_1 = require("../models/message_status");
const sequelize_2 = require("sequelize");
class InboxService {
    createInbox(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_1.default.transaction();
            try {
                const { id } = yield inbox_1.default.create({ otherId: data.otherId, userId: user.id, messageAt: new Date() }, { transaction });
                yield inbox_1.default.create({
                    otherId: user.id,
                    userId: data.otherId,
                    inboxId: id,
                    messageAt: new Date(),
                }, { transaction });
                yield inbox_1.default.update({ inboxId: id }, { where: { id }, transaction });
                transaction.commit();
                feedback.data = (yield inbox_1.default.findByPk(id, {
                    include: [
                        { model: user_1.default, as: "other", attributes: UserDTO_1.default },
                        { model: message_1.default, limit: 1 },
                    ],
                }));
            }
            catch (error) {
                feedback.message = errors_1.default.createMessage;
                feedback.success = false;
                console.debug(error);
            }
            return feedback;
        });
    }
    getInboxes(page = 1, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const pager = new pagination_1.default(page);
                const { count, rows } = yield inbox_1.default.findAndCountAll({
                    offset: pager.startIndex,
                    limit: pager.pageSize,
                    where: {
                        userId: user.id,
                    },
                    include: [
                        { model: user_1.default, as: "other", attributes: UserDTO_1.default, required: true },
                        {
                            model: message_1.default,
                            limit: 1,
                            order: [["createdAt", "DESC"]],
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
                        },
                    ],
                    order: [["messageAt", "DESC"]],
                });
                feedback.results = rows;
                feedback.totalPages = pager.totalPages(count);
                feedback.page = pager.page;
            }
            catch (error) {
                feedback.message = errors_1.default.createMessage;
                feedback.success = false;
                console.debug(error);
            }
            return feedback;
        });
    }
    getInbox(otherId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                feedback.data = yield inbox_1.default.findOne({
                    where: {
                        userId: user.id,
                        otherId,
                    },
                    include: [
                        { model: user_1.default, as: "other", attributes: UserDTO_1.default, required: true },
                        {
                            model: message_1.default,
                            limit: 1,
                            order: [["createdAt", "DESC"]],
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
                        },
                    ],
                });
            }
            catch (error) {
                feedback.message = errors_1.default.createMessage;
                feedback.success = false;
                console.debug(error);
            }
            return feedback;
        });
    }
    hasNewInboxMessages(user, lastCheck) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            console.log("has new messages");
            try {
                feedback.results = yield inbox_1.default.findAll({
                    where: { userId: user.id },
                    include: [
                        { model: user_1.default, as: "other", attributes: UserDTO_1.default, required: true },
                        {
                            model: message_1.default,
                            where: {
                                status: message_status_1.MessageStatus.UNREAD,
                                userId: {
                                    [sequelize_2.Op.ne]: user.id,
                                },
                                createdAt: {
                                    [sequelize_2.Op.gte]: lastCheck,
                                },
                            },
                            order: [["createdAt", "DESC"]],
                            attributes: [
                                "id",
                                "userId",
                                "inboxId",
                                "content",
                                "status",
                                [
                                    sequelize_1.default.cast(sequelize_1.default.where(sequelize_1.default.col("messages.userId"), user.id), "int"),
                                    "isOwner",
                                ],
                            ],
                        },
                    ],
                });
            }
            catch (error) {
                feedback.message = errors_1.default.updateMessage;
                feedback.success = false;
                console.debug(error);
            }
            return feedback;
        });
    }
}
exports.default = InboxService;
//# sourceMappingURL=inbox.service.js.map