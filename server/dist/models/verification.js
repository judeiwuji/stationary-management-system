"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const requisition_1 = __importDefault(require("./requisition"));
const user_1 = __importDefault(require("./user"));
const recommendation_1 = __importDefault(require("./recommendation"));
const audit_1 = __importDefault(require("./audit"));
let Verification = class Verification extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20), allowNull: false }),
    __metadata("design:type", String)
], Verification.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => requisition_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Verification.prototype, "requisitionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => requisition_1.default),
    __metadata("design:type", requisition_1.default)
], Verification.prototype, "requisition", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => recommendation_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Verification.prototype, "recommendationId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => recommendation_1.default),
    __metadata("design:type", recommendation_1.default)
], Verification.prototype, "recommendation", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => audit_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Verification.prototype, "auditId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => audit_1.default),
    __metadata("design:type", audit_1.default)
], Verification.prototype, "audit", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Verification.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default),
    __metadata("design:type", user_1.default)
], Verification.prototype, "user", void 0);
Verification = __decorate([
    sequelize_typescript_1.Table
], Verification);
exports.default = Verification;
//# sourceMappingURL=verification.js.map