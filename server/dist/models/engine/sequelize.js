"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const mysql = __importStar(require("mysql2"));
const dotenv = __importStar(require("dotenv"));
const department_1 = __importDefault(require("../department"));
const user_1 = __importDefault(require("../user"));
const stock_1 = __importDefault(require("../stock"));
const requisition_1 = __importDefault(require("../requisition"));
const requisition_item_1 = __importDefault(require("../requisition_item"));
const order_1 = __importDefault(require("../order"));
const order_item_1 = __importDefault(require("../order_item"));
const message_1 = __importDefault(require("../message"));
const session_1 = __importDefault(require("../session"));
const comment_1 = __importDefault(require("../comment"));
const receipt_1 = __importDefault(require("../receipt"));
const recommendation_1 = __importDefault(require("../recommendation"));
const audit_1 = __importDefault(require("../audit"));
const verification_1 = __importDefault(require("../verification"));
const inbox_1 = __importDefault(require("../inbox"));
const cart_1 = __importDefault(require("../cart"));
dotenv.config();
const db = new sequelize_typescript_1.Sequelize({
    database: process.env["DB_NAME"],
    host: process.env["DB_HOST"],
    password: process.env["DB_PASS"],
    username: process.env["DB_USER"],
    dialect: "mysql",
    dialectModule: mysql,
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        paranoid: true,
        timestamps: true,
    },
    models: [
        department_1.default,
        user_1.default,
        stock_1.default,
        requisition_1.default,
        requisition_item_1.default,
        order_1.default,
        order_item_1.default,
        inbox_1.default,
        message_1.default,
        session_1.default,
        comment_1.default,
        receipt_1.default,
        recommendation_1.default,
        audit_1.default,
        verification_1.default,
        cart_1.default,
    ],
    logging: false,
    timezone: "+01:00",
});
exports.default = db;
//# sourceMappingURL=sequelize.js.map