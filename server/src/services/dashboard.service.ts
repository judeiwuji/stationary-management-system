import { DashboardAnalytics } from "../models/dashbaord";
import Department from "../models/department";
import Feedback from "../models/feedback";
import Order from "../models/order";
import Requisition from "../models/requisition";
import Stock from "../models/stock";
import User from "../models/user";

export default class DashboardService {
  async getAnalytics() {
    const feedback = new Feedback<DashboardAnalytics>();
    try {
      feedback.data = {
        stockCount: await Stock.count(),
        orderCount: await Order.count(),
        requisitionCount: await Requisition.count(),
        departmentCount: await Department.count(),
        userCount: await User.count(),
      };
    } catch (error) {
      console.log(error);
      feedback.message = "Failed to generate analytics data";
      feedback.success = false;
    }
    return feedback;
  }
}
