import UserDTO from "../models/DTO/UserDTO";
import db from "../models/engine/sequelize";
import Errors from "../models/errors";
import Feedback from "../models/feedback";
import Message, {
  MessageAttributes,
  MessageCreationAttributes,
} from "../models/message";
import Pagination from "../models/pagination";
import User from "../models/user";
import { MessageStatus } from "../models/message_status";
import Inbox from "../models/inbox";
import { Op } from "sequelize";

export default class MessageService {
  async createMessage(
    data: MessageCreationAttributes,
    inboxId: number,
    user: User
  ) {
    const feedback = new Feedback<Message>();

    try {
      const { id } = await Message.create({
        content: data.content,
        inboxId: inboxId,
        status: MessageStatus.UNREAD,
        userId: user.id,
      });

      feedback.data = (await Message.findByPk(id, {
        attributes: [
          "id",
          "userId",
          "inboxId",
          "content",
          "status",
          [db.cast(db.where(db.col("userId"), user.id), "int"), "isOwner"],
        ],
        include: [{ model: User, attributes: UserDTO }],
      })) as Message;
    } catch (error) {
      feedback.message = Errors.createMessage;
      feedback.success = false;
      console.log(error);
    }
    return feedback;
  }

  async getMessages(page = 1, inboxId: number, user: User) {
    const feedback = new Feedback<Message>();

    try {
      const pager = new Pagination(page);
      // Mark other inbox user messages as read
      await Message.update(
        { status: MessageStatus.READ },
        {
          where: {
            inboxId,
            userId: {
              [Op.ne]: user.id,
            },
          },
        }
      );

      feedback.results = await Message.findAll({
        where: { inboxId: inboxId },
        offset: pager.startIndex,
        limit: pager.pageSize,
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "userId",
          "inboxId",
          "content",
          "status",
          [db.cast(db.where(db.col("userId"), user.id), "int"), "isOwner"],
        ],
        include: [{ model: User, attributes: UserDTO }],
      });
    } catch (error) {
      feedback.message = Errors.getMessage;
      feedback.success = false;
      console.debug(error);
    }
    return feedback;
  }

  async updateMessage(data: MessageAttributes, inboxId: number) {
    const feedback = new Feedback<boolean>();

    try {
      const [affectedCount] = await Message.update(
        { status: data.status, content: data.content },
        { where: { inboxId } }
      );
      feedback.data = affectedCount > 0;
    } catch (error) {
      feedback.message = Errors.updateMessage;
      feedback.success = false;
      console.debug(feedback);
    }
    return feedback;
  }

  async countUnreadMessages(user: User) {
    const feedback = new Feedback<number>();

    try {
      const count = await Inbox.count({
        where: { userId: user.id },
        include: [{ model: Message, where: { status: MessageStatus.UNREAD } }],
      });
      console.log(count);
      feedback.data = count;
    } catch (error) {
      feedback.message = Errors.updateMessage;
      feedback.success = false;
      console.debug(feedback);
    }
    return feedback;
  }
}
