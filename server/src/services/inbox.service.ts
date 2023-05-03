import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Inbox, { InboxCreationAttributes } from "../models/inbox";
import Message from "../models/message";
import Pagination from "../models/pagination";
import User from "../models/user";
import UserDTO from "../models/DTO/UserDTO";
import db from "../models/engine/sequelize";

export default class InboxService {
  async createInbox(data: InboxCreationAttributes, user: User) {
    const feedback = new Feedback<Inbox>();
    const transaction = await db.transaction();
    try {
      const { id } = await Inbox.create(
        { otherId: data.otherId, userId: user.id },
        { transaction }
      );
      await Inbox.create(
        { otherId: user.id, userId: data.otherId, inboxId: id },
        { transaction }
      );
      await Inbox.update({ inboxId: id }, { where: { id }, transaction });
      transaction.commit();
      feedback.data = (await Inbox.findByPk(id, {
        include: [
          { model: User, as: "other", attributes: UserDTO },
          { model: Message, limit: 1 },
        ],
      })) as Inbox;
    } catch (error) {
      feedback.message = Errors.createMessage;
      feedback.success = false;
      console.debug(error);
    }
    return feedback;
  }

  async getInboxes(page = 1, user: User) {
    const feedback = new Feedback<Inbox>();
    try {
      const pager = new Pagination(page);

      feedback.results = await Inbox.findAll({
        offset: pager.startIndex,
        limit: pager.pageSize,
        where: {
          userId: user.id,
        },
        include: [
          { model: User, as: "other", attributes: UserDTO, required: true },
          {
            model: Message,
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
      });
    } catch (error) {
      feedback.message = Errors.createMessage;
      feedback.success = false;
      console.debug(error);
    }
    return feedback;
  }

  async getInbox(otherId: number, user: User) {
    const feedback = new Feedback<Inbox | null>();
    try {
      feedback.data = await Inbox.findOne({
        where: {
          userId: user.id,
          otherId,
        },
        include: [
          { model: User, as: "other", attributes: UserDTO, required: true },
          {
            model: Message,
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
      });
    } catch (error) {
      feedback.message = Errors.createMessage;
      feedback.success = false;
      console.debug(error);
    }
    return feedback;
  }
}
