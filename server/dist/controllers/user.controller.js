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
const user_schema_1 = require("../validators/schema/user.schema");
const validate_1 = __importDefault(require("../validators/validate"));
const user_service_1 = __importDefault(require("../services/user.service"));
const converter_1 = __importDefault(require("../models/converter"));
class UserController {
    constructor() {
        this.userService = new user_service_1.default();
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(user_schema_1.UserCreationSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.userService.createUser(validation.data);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.status(201).send(feedback);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(user_schema_1.UserUpdateSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const feedback = yield this.userService.updateUser(validation.data);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.send(feedback);
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.query.page) || 1;
            const filters = converter_1.default.toJson(`${req.query.filters}`);
            const search = req.query.search;
            const feedback = yield this.userService.getUsers(page, filters, search);
            if (!feedback.success) {
                return res.status(400).send(feedback.message);
            }
            res.send(feedback);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send("id is required");
            }
            const feedback = yield this.userService.deleteUser(id);
            if (!feedback.success) {
                return res.status(404).send(feedback.message);
            }
            res.send(feedback);
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map