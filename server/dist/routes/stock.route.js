"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_manager_1 = __importDefault(require("../middlewares/session-manager"));
const role_1 = require("../models/role");
const stock_controller_1 = __importDefault(require("../controllers/stock.controller"));
class StockRoute {
    constructor(app) {
        this.app = app;
        this.stockController = new stock_controller_1.default();
        this.routes();
    }
    routes() {
        this.app.post("/api/stocks/", session_manager_1.default.authorize([role_1.Roles.STOCK_MANAGER]), (req, res) => this.stockController.createStock(req, res));
        this.app.get("/api/stocks/", session_manager_1.default.ensureAuthenticated, (req, res) => this.stockController.getStocks(req, res));
        this.app.put("/api/stocks/", session_manager_1.default.authorize([role_1.Roles.STOCK_MANAGER]), (req, res) => this.stockController.updateStock(req, res));
        this.app.delete("/api/stocks/:id", session_manager_1.default.authorize([role_1.Roles.STOCK_MANAGER]), (req, res) => this.stockController.deleteStock(req, res));
    }
}
exports.default = StockRoute;
//# sourceMappingURL=stock.route.js.map