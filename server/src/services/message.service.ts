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
import Inbox, { InboxCreationAttributes } from "../models/inbox";
import { Op } from "sequelize";

export default class MessageService {
  async createNewMessage(
    data: MessageCreationAttributes & InboxCreationAttributes,
    user: User
  ) {
    const feedback = new Feedback<Message>();
    const transaction = await db.transaction();

    try {
      const inbox = await Inbox.create(
        { otherId: data.otherId, userId: user.id },
        { transaction }
      );

      await Inbox.create(
        { otherId: user.id, userId: data.otherId, inboxId: inbox.id },
        { transaction }
      );
      await Inbox.update(
        { inboxId: inbox.id },
        { where: { id: inbox.id }, transaction }
      );

      const message = await Message.create(
        {
          content: data.content,
          inboxId: inbox.id,
          status: MessageStatus.UNREAD,
          userId: user.id,
        },
        { transaction }
      );

      feedback.data = (await Message.findByPk(message.id, {
        attributes: [
          "id",
          "userId",
          "inboxId",
          "content",
          "status",
          [
            db.cast(db.where(db.col("Message.userId"), user.id), "int"),
            "isOwner",
          ],
        ],
        include: [
          { model: User, attributes: UserDTO },
          {
            model: Inbox,
            include: [
              { model: User, attributes: UserDTO, as: "other" },
              { model: Message, limit: 1 },
            ],
          },
        ],
        transaction,
      })) as Message;
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      feedback.message = Errors.createMessage;
      feedback.success = false;
      console.log(error);
    }
    return feedback;
  }

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
        include: [
          {
            model: Message,
            where: {
              status: MessageStatus.UNREAD,
              userId: {
                [Op.ne]: user.id,
              },
            },
          },
        ],
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
