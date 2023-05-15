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
const user_1 = __importDefault(require("./user"));
const department_1 = __importDefault(require("./department"));
const requisition_item_1 = __importDefault(require("./requisition_item"));
const comment_1 = __importDefault(require("./comment"));
let Requisition = class Requisition extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Requisition.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default),
    __metadata("design:type", user_1.default)
], Requisition.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => department_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Requisition.prototype, "sourceId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => department_1.default),
    __metadata("design:type", department_1.default)
], Requisition.prototype, "department", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Requisition.prototype, "through", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Requisition.prototype, "destination", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(300)),
    __metadata("design:type", String)
], Requisition.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(40)),
    __metadata("design:type", String)
], Requisition.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => requisition_item_1.default),
    __metadata("design:type", Array)
], Requisition.prototype, "items", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => comment_1.default),
    __metadata("design:type", Array)
], Requisition.prototype, "comments", void 0);
Requisition = __decorate([
    sequelize_typescript_1.Table
], Requisition);
exports.default = Requisition;
//# sourceMappingURL=requisition.js.map