import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Inbox, { InboxCreationAttributes } from "../models/inbox";
import Message from "../models/message";
import Pagination from "../models/pagination";
import User from "../models/user";
import UserDTO from "../models/DTO/UserDTO";
import db from "../models/engine/sequelize";
import { MessageStatus } from "../models/message_status";
import { Op } from "sequelize";

export default class InboxService {
  async createInbox(data: InboxCreationAttributes, user: User) {
    const feedback = new Feedback<Inbox>();
    const transaction = await db.transaction();
    try {
      const { id } = await Inbox.create(
        { otherId: data.otherId, userId: user.id, messageAt: new Date() },
        { transaction }
      );
      await Inbox.create(
        {
          otherId: user.id,
          userId: data.otherId,
          inboxId: id,
          messageAt: new Date(),
        },
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
        order: [["messageAt", "DESC"]],
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

  async hasNewInboxMessages(user: User, lastCheck: Date) {
    const feedback = new Feedback<Inbox>();
    console.log("has new messages");
    try {
      feedback.results = await Inbox.findAll({
        where: { userId: user.id },
        include: [
          { model: User, as: "other", attributes: UserDTO, required: true },
          {
            model: Message,
            where: {
              status: MessageStatus.UNREAD,
              userId: {
                [Op.ne]: user.id,
              },
              createdAt: {
                [Op.gte]: lastCheck,
              },
            },
            order: [["createdAt", "DESC"]],
          },
        ],
      });
    } catch (error) {
      feedback.message = Errors.updateMessage;
      feedback.success = false;
      console.debug(feedback);
    }
    return feedback;
  }
}
