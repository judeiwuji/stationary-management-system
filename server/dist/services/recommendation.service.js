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
const department_1 = __importDefault(require("../models/department"));
const sequelize_1 = __importDefault(require("../models/engine/sequelize"));
const errors_1 = __importDefault(require("../models/errors"));
const feedback_1 = __importDefault(require("../models/feedback"));
const pagination_1 = __importDefault(require("../models/pagination"));
const recommendation_1 = __importDefault(require("../models/recommendation"));
const requisition_1 = __importDefault(require("../models/requisition"));
const role_1 = require("../models/role");
const user_1 = __importDefault(require("../models/user"));
class RecommendationService {
    createRecommendation(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_1.default.transaction();
            try {
                feedback.data = yield recommendation_1.default.create({
                    requisitionId: data.requisitionId,
                    status: data.status,
                    userId: user.id,
                }, {
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        {
                            model: requisition_1.default,
                            include: [{ model: user_1.default, attributes: UserDTO_1.default }],
                        },
                    ],
                    transaction,
                });
                yield requisition_1.default.update({ status: data.status }, { where: { id: data.requisitionId }, transaction });
                yield transaction.commit();
            }
            catch (error) {
                yield transaction.rollback();
                feedback.success = false;
                feedback.message = errors_1.default.createMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    getRecommendations(page = 1, filters, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const query = filters ? Object.assign({}, filters) : {};
                const pager = new pagination_1.default(page);
                const { rows, count } = yield recommendation_1.default.findAndCountAll({
                    where: query,
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        {
                            model: requisition_1.default,
                            include: [
                                { model: user_1.default, attributes: UserDTO_1.default },
                                { model: department_1.default },
                            ],
                        },
                    ],
                    attributes: [
                        "id",
                        "status",
                        "requisitionId",
                        "userId",
                        "createdAt",
                        "updatedAt",
                        [
                            sequelize_1.default.cast(sequelize_1.default.where(sequelize_1.default.col("Recommendation.userId"), user.id), "int"),
                            "isOwner",
                        ],
                        [
                            sequelize_1.default.cast(sequelize_1.default.literal(`${user.role === role_1.Roles.AUDITOR}`), "int"),
                            "isAuditor",
                        ],
                    ],
                    order: [["createdAt", "DESC"]],
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
    updateRecommendation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            const transaction = yield sequelize_1.default.transaction();
            try {
                const recommedation = yield recommendation_1.default.findByPk(data.id, {
                    transaction,
                });
                if (!recommedation) {
                    feedback.message = "Recommendation not found";
                    feedback.success = false;
                    yield transaction.rollback();
                    return feedback;
                }
                yield recommendation_1.default.update({
                    status: data.status,
                }, { where: { id: data.id }, transaction });
                yield requisition_1.default.update({ status: data.status }, { where: { id: recommedation.requisitionId }, transaction });
                transaction.commit();
                feedback.data = yield recommendation_1.default.findByPk(data.id, {
                    include: [
                        { model: user_1.default, attributes: UserDTO_1.default },
                        {
                            model: requisition_1.default,
                            include: [{ model: user_1.default, attributes: UserDTO_1.default }],
                        },
                    ],
                });
            }
            catch (error) {
                yield transaction.rollback();
                feedback.success = false;
                feedback.message = errors_1.default.updateMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    deleteRecommendation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const result = yield recommendation_1.default.destroy({ where: { id } });
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
exports.default = RecommendationService;
//# sourceMappingURL=recommendation.service.js.map