import { Response } from "express";
import IRequest from "../models/interfaces/irequest";
import validate from "../validators/validate";
import { InboxCreationAttributes } from "../models/inbox";
import { InboxSchema } from "../validators/schema/inbox.schema";
import InboxService from "../services/inbox.service";
import User from "../models/user";

export default class InboxController {
  inboxService = new InboxService();

  async createInbox(req: IRequest, res: Response) {
    const validation = await validate<InboxCreationAttributes>(
      InboxSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.inboxService.createInbox(
      validation.data,
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.status(201).send(feedback);
  }

  async getAllInbox(req: IRequest, res: Response) {
    const page = Number(req.query.page) || 1;

    const feedback = await this.inboxService.getInboxes(page, req.user as User);
    res.send(feedback);
  }

  async getInbox(req: IRequest, res: Response) {
    const otherId = Number(req.params.id);

    const feedback = await this.inboxService.getInbox(
      otherId,
      req.user as User
    );
    res.send(feedback);
  }

  async hasNewInboxMessages(req: IRequest, res: Response) {
    const { timestamp } = req.query;

    const feedback = await this.inboxService.hasNewInboxMessages(
      req.user as User,
      new Date(Number(timestamp))
    );
    res.send(feedback);
  }
}
