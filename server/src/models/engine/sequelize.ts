import { Sequelize } from "sequelize-typescript";
import * as mysql from "mysql2";
import * as dotenv from "dotenv";
import Department from "../department";
import User from "../user";
import Stock from "../stock";
import Requisition from "../requisition";
import RequisitionItem from "../requisition_item";
import Order from "../order";
import OrderItem from "../order_item";
import Chat from "../chat";
import Session from "../session";
import Comment from "../comment";
import Purchase from "../purchase";
import Recommendation from "../recommendation";
import Audit from "../audit";
import Verification from "../verification";
dotenv.config();

const db = new Sequelize({
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
    Department,
    User,
    Stock,
    Requisition,
    RequisitionItem,
    Order,
    OrderItem,
    Chat,
    Session,
    Comment,
    Purchase,
    Recommendation,
    Audit,
    Verification,
  ],
});

export default db;
