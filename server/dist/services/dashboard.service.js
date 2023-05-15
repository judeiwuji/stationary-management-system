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
const department_1 = __importDefault(require("../models/department"));
const feedback_1 = __importDefault(require("../models/feedback"));
const order_1 = __importDefault(require("../models/order"));
const requisition_1 = __importDefault(require("../models/requisition"));
const stock_1 = __importDefault(require("../models/stock"));
const user_1 = __importDefault(require("../models/user"));
class DashboardService {
    getAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const feedback = new feedback_1.default();
            try {
                feedback.data = {
                    stockCount: yield stock_1.default.count(),
                    orderCount: yield order_1.default.count(),
                    requisitionCount: yield requisition_1.default.count(),
                    departmentCount: yield department_1.default.count(),
                    userCount: yield user_1.default.count(),
                };
            }
            catch (error) {
                console.log(error);
                feedback.message = "Failed to generate analytics data";
                feedback.success = false;
            }
            return feedback;
        });
    }
}
exports.default = DashboardService;
//# sourceMappingURL=dashboard.service.js.map