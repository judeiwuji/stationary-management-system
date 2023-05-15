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
var Inbox_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = __importDefault(require("./user"));
const message_1 = __importDefault(require("./message"));
let Inbox = Inbox_1 = class Inbox extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], Inbox.prototype, "messageAt", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    __metadata("design:type", Number)
], Inbox.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default, { foreignKey: "userId" }),
    __metadata("design:type", user_1.default)
], Inbox.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    __metadata("design:type", Number)
], Inbox.prototype, "otherId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default, { foreignKey: "otherId" }),
    __metadata("design:type", user_1.default)
], Inbox.prototype, "other", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => Inbox_1),
    __metadata("design:type", Number)
], Inbox.prototype, "inboxId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Inbox_1),
    __metadata("design:type", Inbox)
], Inbox.prototype, "inbox", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => message_1.default, { sourceKey: "inboxId" }),
    __metadata("design:type", Array)
], Inbox.prototype, "messages", void 0);
Inbox = Inbox_1 = __decorate([
    sequelize_typescript_1.Table
], Inbox);
exports.default = Inbox;
//# sourceMappingURL=inbox.js.map