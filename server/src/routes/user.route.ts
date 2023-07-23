import { Application } from 'express';
import IRoute from '../models/interfaces/iroute';
import UserController from '../controllers/user.controller';
import SessionManager from '../middlewares/session-manager';
import { Roles } from '../models/role';

export default class UserRoute implements IRoute {
  userController = new UserController();

  constructor(private app: Application) {
    this.routes();
  }

  routes(): void {
    this.app.post(
      '/api/users',
      // SessionManager.ensureAuthenticated,
      // SessionManager.authorize([Roles.ADMIN]),
      (req, res) => this.userController.createUser(req, res)
    );

    this.app.put('/api/users', SessionManager.ensureAuthenticated, (req, res) =>
      this.userController.updateUser(req, res)
    );

    this.app.get('/api/users', SessionManager.ensureAuthenticated, (req, res) =>
      this.userController.getUsers(req, res)
    );

    this.app.delete(
      '/api/users/:id?',
      SessionManager.ensureAuthenticated,
      SessionManager.authorize([Roles.ADMIN]),
      (req, res) => this.userController.deleteUser(req, res)
    );

    this.app.get('/api/users/identify', (req, res) =>
      this.userController.identifyUser(req, res)
    );

    this.app.post('/api/users/reset/password', (req, res) =>
      this.userController.resetPassword(req, res)
    );
  }
}
