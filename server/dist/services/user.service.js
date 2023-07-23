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
const sequelize_1 = require("sequelize");
const UserDTO_1 = __importDefault(require("../models/DTO/UserDTO"));
const errors_1 = __importDefault(require("../models/errors"));
const feedback_1 = __importDefault(require("../models/feedback"));
const pagination_1 = __importDefault(require("../models/pagination"));
const role_1 = require("../models/role");
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = require("bcryptjs");
class UserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const emailExists = yield user_1.default.findOne({ where: { email: data.email } });
                if (emailExists) {
                    feedback.success = false;
                    feedback.message = 'Email already exists';
                    return feedback;
                }
                const salt = yield (0, bcryptjs_1.genSalt)(10);
                const password = yield (0, bcryptjs_1.hash)(data.password, salt);
                const role = typeof data.role === 'number' ? data.role : Number(role_1.Roles[data.role]);
                const { id } = yield user_1.default.create({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    role,
                    password,
                });
                feedback.data = (yield user_1.default.findByPk(id, {
                    attributes: UserDTO_1.default,
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
    updateUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const role = typeof data.role === 'number' ? data.role : Number(role_1.Roles[data.role]);
                yield user_1.default.update({ firstname: data.firstname, lastname: data.lastname, role }, { where: { id: data.id } });
                feedback.data = (yield user_1.default.findByPk(data.id, {
                    attributes: UserDTO_1.default,
                }));
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.updateMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                feedback.data = yield user_1.default.destroy({ where: { id } });
                if (feedback.data === 0) {
                    feedback.success = false;
                    feedback.message = 'Not found';
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
    getUsers(page = 1, filters, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const pager = new pagination_1.default(page);
                let query = {};
                query = search
                    ? {
                        [sequelize_1.Op.or]: {
                            firstname: { [sequelize_1.Op.like]: `%${search}%` },
                            lastname: { [sequelize_1.Op.like]: `%${search}%` },
                            email: { [sequelize_1.Op.like]: `%${search}%` },
                        },
                    }
                    : query;
                query = filters ? Object.assign(Object.assign({}, query), filters) : query;
                feedback.page = page;
                feedback.results = yield user_1.default.findAll({
                    attributes: UserDTO_1.default,
                    offset: pager.startIndex,
                    limit: pager.pageSize,
                    where: query,
                    order: [['lastname', 'ASC']],
                });
                feedback.totalPages = pager.totalPages(yield user_1.default.count({ where: query }), pager.pageSize);
            }
            catch (error) {
                feedback.success = false;
                feedback.message = errors_1.default.getMessage;
                console.debug(error);
            }
            return feedback;
        });
    }
    findUserBy(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ where: query });
            if (!user) {
                throw new Error('No record found');
            }
            return user;
        });
    }
    resetPassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield (0, bcryptjs_1.genSalt)(10);
            const hashedPassword = yield (0, bcryptjs_1.hash)(request.newPassword, salt);
            const user = yield this.findUserBy({ id: request.userId });
            yield user.update({ password: hashedPassword });
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map