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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const validate_1 = __importDefault(require("../validators/validate"));
const auth_schema_1 = require("../validators/schema/auth.schema");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.default();
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield (0, validate_1.default)(auth_schema_1.AuthSchema, req.body);
            if (!validation.success) {
                return res.status(400).send(validation.message);
            }
            const request = validation.data;
            request.userAgent = req.headers["user-agent"];
            const feedback = yield this.authService.authenticate(request);
            if (!feedback.success) {
                res.statusMessage = feedback.message;
                return res.status(400).send(feedback.message);
            }
            res.setHeader("x-access", feedback.data.token);
            res.send(feedback);
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers.authorization;
            if (authorization) {
                const token = authorization.split(" ")[1];
                yield this.authService.logout(token);
            }
            res.send(true);
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map