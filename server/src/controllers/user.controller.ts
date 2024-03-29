import { Request, Response } from 'express';
import {
  IdentifyUserSchema,
  ResetPasswordSchema,
  UserCreationSchema,
  UserUpdateSchema,
} from '../validators/schema/user.schema';
import validate from '../validators/validate';
import { UserAttributes, UserCreationAttributes } from '../models/user';
import UserService from '../services/user.service';
import Converter from '../models/converter';

export default class UserController {
  userService = new UserService();

  async createUser(req: Request, res: Response) {
    const validation = await validate<UserCreationAttributes>(
      UserCreationSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.userService.createUser(validation.data);
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.status(201).send(feedback);
  }

  async updateUser(req: Request, res: Response) {
    const validation = await validate<UserAttributes>(
      UserUpdateSchema,
      req.body
    );

    if (!validation.success) {
      return res.status(400).send(validation.message);
    }
    const feedback = await this.userService.updateUser(validation.data);
    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.send(feedback);
  }

  async getUsers(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const filters = Converter.toJson(`${req.query.filters}`);
    const search: any = req.query.search;
    const feedback = await this.userService.getUsers(page, filters, search);

    if (!feedback.success) {
      return res.status(400).send(feedback.message);
    }
    res.send(feedback);
  }

  async deleteUser(req: Request, res: Response) {
    const id: any = req.params.id;

    if (!id) {
      return res.status(400).send('id is required');
    }
    const feedback = await this.userService.deleteUser(id);

    if (!feedback.success) {
      return res.status(404).send(feedback.message);
    }
    res.send(feedback);
  }

  async identifyUser(req: Request, res: Response) {
    try {
      const user = await this.userService.findUserBy({
        email: req.query.email,
      });
      res.send(user);
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const formData = (await validate<any>(ResetPasswordSchema, req.body))
        .data;
      await this.userService.resetPassword(formData);
      res.send({ status: true });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }
}
