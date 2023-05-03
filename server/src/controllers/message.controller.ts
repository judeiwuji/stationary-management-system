import { Response } from "express";
import IRequest from "../models/interfaces/irequest";
import {
  MessageCreationSchema,
  MessageUpdateSchema,
} from "../validators/schema/inbox.schema";
import validate from "../validators/validate";
import {
  MessageAttributes,
  MessageCreationAttributes,
} from "../models/message";
import MessageService from "../services/message.service";
import User from "../models/user";

export default class MessageController {
  messageService = new MessageService();
  async createMessage(req: IRequest, res: Response) {
    const inboxId = req.params.id;
    const validation = await validate<MessageCreationAttributes>(
      MessageCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.messageService.createMessage(
      validation.data,
      Number(inboxId),
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.status(201).send(feedback);
  }

  async getMessages(req: IRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    const inboxId = req.params.id;

    const feedback = await this.messageService.getMessages(
      page,
      Number(inboxId),
      req.user as User
    );
    res.send(feedback);
  }

  async updateMessage(req: IRequest, res: Response) {
    const inboxId = req.params.id;
    const validation = await validate<MessageAttributes>(
      MessageUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }

    const feedback = await this.messageService.updateMessage(
      validation.data,
      Number(inboxId)
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.send(feedback);
  }

  async countUnReadMessages(req: IRequest, res: Response) {
    const feedback = await this.messageService.countUnreadMessages(
      req.user as User
    );
    res.send(feedback);
  }
}
