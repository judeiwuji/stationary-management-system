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
const feedback_1 = __importDefault(require("../models/feedback"));
const role_1 = require("../models/role");
const session_1 = __importDefault(require("../models/session"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthService {
    constructor() {
        this.accessTokenTimeout = process.env.ACCESS_TOKEN_TIMEOUT;
        this.refreshTokenTimeout = process.env.REFRESH_TOKEN_TIMEOUT;
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtIssuer = process.env.JWT_ISSUER;
    }
    createAccessToken(payload) {
        return (0, jsonwebtoken_1.sign)(payload, this.jwtSecret, {
            expiresIn: this.accessTokenTimeout,
            issuer: this.jwtIssuer,
        });
    }
    createRefreshToken(payload) {
        return (0, jsonwebtoken_1.sign)(payload, this.jwtSecret, {
            expiresIn: this.refreshTokenTimeout,
            issuer: this.jwtIssuer,
        });
    }
    decodeToken(token) {
        let data = null;
        try {
            data = (0, jsonwebtoken_1.decode)(token);
        }
        catch (error) {
            console.log(error);
        }
        return data;
    }
    verifyToken(token) {
        const result = { data: null, expired: false };
        try {
            result.data = (0, jsonwebtoken_1.verify)(token, this.jwtSecret, {
                issuer: this.jwtIssuer,
            });
        }
        catch (error) {
            console.log(error);
            result.expired = true;
            result.data = this.decodeToken(token);
        }
        return result;
    }
    refreshToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const session = yield session_1.default.findByPk(data.session);
                if (!session) {
                    feedback.success = false;
                    feedback.message = 'Session not found';
                    return feedback;
                }
                if (!session.valid) {
                    feedback.success = false;
                    feedback.message = 'Session closed';
                    return feedback;
                }
                const verified = this.verifyToken(session.refreshToken);
                if (verified.expired) {
                    session.valid = false;
                    session.save();
                    feedback.success = false;
                    feedback.message = 'Expired session';
                    return feedback;
                }
                const accessToken = this.createAccessToken({
                    user: session.userId,
                    session: session.id,
                });
                const refreshToken = this.createRefreshToken({ user: session.userId });
                yield session_1.default.update({ refreshToken: refreshToken }, { where: { id: data.session } });
                feedback.data = accessToken;
            }
            catch (error) {
                feedback.success = false;
                feedback.message = 'Server was unable to refresh session';
                console.log(error);
            }
            return feedback;
        });
    }
    authenticate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                const user = yield user_1.default.findOne({ where: { email: data.email } });
                if (!user) {
                    feedback.success = false;
                    feedback.message = 'Wrong password and email combination';
                    return feedback;
                }
                if (!(yield (0, bcryptjs_1.compare)(data.password, user.password))) {
                    feedback.success = false;
                    feedback.message = 'Wrong password and email combination';
                    return feedback;
                }
                yield session_1.default.update({ valid: false }, { where: { userId: user.id } });
                const refreshToken = this.createRefreshToken({ user: user.id });
                const session = yield session_1.default.create({
                    refreshToken,
                    userId: user.id,
                    userAgent: data.userAgent,
                    valid: true,
                });
                feedback.data = {
                    token: this.createAccessToken({
                        user: user.id,
                        session: session.id,
                    }),
                    role: role_1.Roles[user.role].toLowerCase(),
                    redirect: `/dashboard`,
                    name: `${user.firstname} ${user.lastname}`,
                };
            }
            catch (error) {
                feedback.success = false;
                feedback.message = 'Authentication failed';
            }
            return feedback;
        });
    }
    authorize(role, allowedRoles) {
        return allowedRoles.includes(role);
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verified = this.verifyToken(token);
                if (verified.data) {
                    yield session_1.default.destroy({ where: { id: verified.data.session } });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isValidSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield session_1.default.findOne({ where: { id, valid: true } });
                console.log(`${id}: Session: ${session}`);
                return session !== null;
            }
            catch (error) {
                console.log(error);
            }
            return false;
        });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map