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
const user_1 = __importDefault(require("../models/user"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const UserDTO_1 = __importDefault(require("../models/DTO/UserDTO"));
class SessionManager {
    static deserializeUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers.authorization || req.query.authorization;
            if (authorization) {
                const authService = new auth_service_1.default();
                const token = authorization.split(" ")[1];
                const verified = authService.verifyToken(token);
                if (!verified.expired && verified.data.user) {
                    req.user = yield user_1.default.findByPk(verified.data.user, {
                        attributes: UserDTO_1.default,
                    });
                }
            }
            next();
        });
    }
    static refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers.authorization || req.query.authorization;
            if (authorization) {
                const authService = new auth_service_1.default();
                const token = authorization.split(" ")[1];
                const verified = authService.verifyToken(token);
                if (yield authService.isValidSession(verified.data.session)) {
                    if (verified.expired) {
                        const feedback = yield authService.refreshToken(verified.data);
                        if (!feedback.success) {
                            return res.status(401).send(feedback.message);
                        }
                        console.log(`Refreshed: ${feedback.data}`);
                        req.headers["authorization"] = `Bearer ${feedback.data}`;
                        res.setHeader("x-access-refresh", feedback.data);
                    }
                }
                else {
                    return res.status(401).send("Invalid Session");
                }
            }
            next();
        });
    }
    static authorize(allowedRoles) {
        return (req, res, next) => {
            var _a;
            const authService = new auth_service_1.default();
            if (req.user && authService.authorize((_a = req.user) === null || _a === void 0 ? void 0 : _a.role, allowedRoles)) {
                return next();
            }
            res.status(403).send("Access forbidden");
        };
    }
    static ensureAuthenticated(req, res, next) {
        const authorization = req.headers.authorization || req.query.authorization;
        if (!authorization || !req.user) {
            return res.status(401).send("Not authenticated");
        }
        next();
    }
}
exports.default = SessionManager;
//# sourceMappingURL=session-manager.js.map