import { Application } from "express";
import IRoute from "../models/interfaces/iroute";
import SessionManager from "../middlewares/session-manager";
import { Roles } from "../models/role";
import ReceiptController from "../controllers/receipt.controller";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const receiptStorage = new CloudinaryStorage({
  cloudinary,
  params: { public_id: (req, res) => "" },
});

const upload = multer({
  storage: receiptStorage,
});

export default class ReceiptRoute implements IRoute {
  receiptController = new ReceiptController();
  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      "/api/receipts",
      upload.single("receipt"),
      SessionManager.authorize([Roles.PURCHASE_OFFICIER]),
      (req, res) => this.receiptController.createReceipt(req, res)
    );

    this.app.get("/api/receipts", (req, res) =>
      this.receiptController.getReceipts(req, res)
    );

    this.app.delete(
      "/api/receipts/:id",
      SessionManager.authorize([Roles.ADMIN, Roles.PURCHASE_OFFICIER]),
      (req, res) => this.receiptController.deleteReceipt(req, res)
    );
  }
}
