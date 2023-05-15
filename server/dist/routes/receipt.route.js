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
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const role_1 = require("../models/role");
const receipt_controller_1 = __importDefault(require("../controllers/receipt.controller"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const receiptStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: { public_id: (req, res) => "" },
});
const upload = (0, multer_1.default)({
    storage: receiptStorage,
});
class ReceiptRoute {
    constructor(app) {
        this.app = app;
        this.receiptController = new receipt_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/receipts", upload.single("receipt"), session_manager_1.default.authorize([role_1.Roles.PURCHASE_OFFICIER]), (req, res) => this.receiptController.createReceipt(req, res));
        this.app.get("/api/receipts", (req, res) => this.receiptController.getReceipts(req, res));
        this.app.delete("/api/receipts/:id", session_manager_1.default.authorize([role_1.Roles.ADMIN, role_1.Roles.PURCHASE_OFFICIER]), (req, res) => this.receiptController.deleteReceipt(req, res));
    }
}
exports.default = ReceiptRoute;
//# sourceMappingURL=receipt.route.js.map