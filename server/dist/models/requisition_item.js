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
const sequelize_1 = require("sequelize");
const stock_1 = __importDefault(require("./stock"));
const receipt_1 = __importDefault(require("./receipt"));
let RequisitionItem = class RequisitionItem extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => requisition_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RequisitionItem.prototype, "requisitionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => requisition_1.default),
    __metadata("design:type", requisition_1.default)
], RequisitionItem.prototype, "requisition", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_1.DataTypes.DECIMAL(8, 2) }),
    __metadata("design:type", Number)
], RequisitionItem.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_1.DataTypes.INTEGER }),
    __metadata("design:type", Number)
], RequisitionItem.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => stock_1.default),
    (0, sequelize_typescript_1.Column)({ allowNull: true }),
    __metadata("design:type", Number)
], RequisitionItem.prototype, "stockId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => stock_1.default),
    __metadata("design:type", stock_1.default)
], RequisitionItem.prototype, "stock", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => receipt_1.default),
    __metadata("design:type", receipt_1.default)
], RequisitionItem.prototype, "receipt", void 0);
RequisitionItem = __decorate([
    sequelize_typescript_1.Table
], RequisitionItem);
exports.default = RequisitionItem;
//# sourceMappingURL=requisition_item.js.map