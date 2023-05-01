import { Request, Response } from "express";
import validate from "../validators/validate";
import CommentService from "../services/comment.service";
import {
  CommentAttributes,
  CommentCreationAttributes,
} from "../models/comment";
import {
  CommentCreationSchema,
  CommentUpdateSchema,
} from "../validators/schema/comment.schema";
import IRequest from "../models/interfaces/irequest";
import User from "../models/user";

export default class CommentController {
  commentService = new CommentService();

  async createComment(req: IRequest, res: Response) {
    const { id } = req.params;
    const validation = await validate<CommentCreationAttributes>(
      CommentCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }

    validation.data.requisitionId = Number(id);
    console.log(req.user);
    const feedback = await this.commentService.createComment(
      validation.data,
      req.user as User
    );
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.status(201).send(feedback);
  }

  async getComments(req: Request, res: Response) {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;

    const feedback = await this.commentService.getComments(page, Number(id));
    res.send(feedback);
  }

  async updateComment(req: Request, res: Response) {
    const validation = await validate<CommentAttributes>(
      CommentUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.commentService.updateComment(validation.data);
    res.send(feedback);
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      res.status(400).send("id is required");
    }
    const feedback = await this.commentService.deleteComment(Number(id));
    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    res.send(feedback);
  }
}
