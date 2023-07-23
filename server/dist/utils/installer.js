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
const role_1 = require("../models/role");
const user_service_1 = __importDefault(require("../services/user.service"));
function installer() {
    return __awaiter(this, void 0, void 0, function* () {
        const userService = new user_service_1.default();
        try {
            yield userService.findUserBy({ role: role_1.Roles.ADMIN });
            return;
        }
        catch (error) {
            // continue
        }
        yield userService.createUser({
            email: 'admin@app.com',
            firstname: 'admin',
            lastname: 'superadmin',
            password: 'admin',
            role: role_1.Roles.ADMIN,
        });
    });
}
exports.default = installer;
//# sourceMappingURL=installer.js.map