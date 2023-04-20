import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Pagination from "../models/pagination";
import Requisition, {
  RequisitionAttributes,
  RequisitionCreationAttributes,
} from "../models/requisition";
import { RequisitionStatus } from "../models/requisition-status";
import { UserAttributes } from "../models/user";

export default class RecommendationService {
  async createRecommendation(
    data: RequisitionCreationAttributes,
    user: UserAttributes
  ) {
    const feedback = new Feedback<Requisition>();

    try {
      const feedback = await Requisition.create({
        description: data.description,
        destination: data.destination,
        through: data.through,
        sourceId: data.sourceId,
        status: RequisitionStatus.PENDING,
        userId: user.id,
      });
    } catch (error) {
      feedback.success = false;
      feedback.message = Errors.createMessage;
      console.debug(error);
    }
    return feedback;
  }

  async getRecommendations(page = 1, filters: any) {
    const feedback = new Feedback<Requisition>();
    try {
      const query = filters ? { ...filters } : {};
      const pager = new Pagination(page);
      const { rows, count } = await Requisition.findAndCountAll({
        where: query,
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

  async updateRecommendation(data: RequisitionAttributes) {
    const feedback = new Feedback();

    try {
      await Requisition.update(
        {
          description: data.description,
          destination: data.destination,
          through: data.through,
          sourceId: data.sourceId,
          status: data.status,
        },
        { where: { id: data.id } }
      );
      feedback.data = await Requisition.findByPk(data.id);
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
      const result = await Requisition.destroy({ where: { id } });
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
