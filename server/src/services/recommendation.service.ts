import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Recommendation, {
  RecommendationAttributes,
  RecommendationCreationAttributes,
} from "../models/recommendation";
import Requisition, {
  RequisitionAttributes,
  RequisitionCreationAttributes,
} from "../models/requisition";
import { RequisitionStatus } from "../models/requisition-status";
import User, { UserAttributes } from "../models/user";

export default class RecommendationService {
  async createRecommendation(
    data: RecommendationCreationAttributes,
    user: UserAttributes
  ) {
    const feedback = new Feedback<Recommendation>();

    try {
      feedback.data = await Recommendation.create(
        {
          requisitionId: data.requisitionId,
          status: RequisitionStatus.PENDING,
          userId: user.id,
        },
        { include: [User, { model: Requisition, include: [User] }] }
      );
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getRecommendations(page = 1, filters: any) {
    const feedback = new Feedback<Recommendation>();
    try {
      const query = filters ? { ...filters } : {};
      const pager = new Pagination(page);
      const { rows, count } = await Recommendation.findAndCountAll({
        where: query,
        include: [User, { model: Requisition, include: [User] }],
      });
      feedback.results = rows;
      feedback.totalPages = pager.totalPages(count);
      feedback.page = page;
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.getMessage;
      console.debug(error);
    }
    return feedback;
  }

  async updateRecommendation(data: RecommendationAttributes) {
    const feedback = new Feedback();

    try {
      await Recommendation.update(
        {
          status: data.status,
        },
        { where: { id: data.id } }
      );
      feedback.data = await Recommendation.findByPk(data.id, {
        include: [User, { model: Requisition, include: [User] }],
      });
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.updateMessage;
      console.debug(error);
    }
    return feedback;
  }

  async deleteRecommendation(id: number) {
    const feedback = new Feedback();

    try {
      const result = await Recommendation.destroy({ where: { id } });
      if (result === 0) {
        feedback.success = false;
        feedback.message = "Not found";
      }
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.deleteMessage;
      console.debug(error);
    }
    return feedback;
  }
}
