import { Application } from 'express';
import express from 'express';
import * as dotEnv from 'dotenv';
import db from './models/engine/sequelize';
import RouteManager from './routes/routemanager';
import SessionManager from './middlewares/session-manager';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import installer from './utils/installer';

dotEnv.config();

class App {
  app!: Application;
  port!: string;

  constructor() {
    this.app = express();
    this.port = `${process.env.PORT}`;
    db.sync({ alter: false });
    installer();
    this.middlewares();
    this.settings();
    this.run();
  }

  middlewares() {
    this.app.use(
      cors({
        exposedHeaders: ['x-access', 'x-access-refresh'],
        origin: '*',
        maxAge: 0,
      })
    );
    this.app.use(morgan('dev'));
    this.app.use(express.static(path.join(__dirname, '../', 'public')));
    this.app.use(express.json({}));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((req, res, next) =>
      SessionManager.refreshToken(req, res, next)
    );
    this.app.use((req, res, next) =>
      SessionManager.deserializeUser(req, res, next)
    );
  }

  settings() {
    new RouteManager(this.app);
    this.app.all('*', (req, res) => {
      const indexFile = path.join(__dirname, '..', 'public', 'index.html');
      res.sendFile(indexFile);
    });
  }

  run() {
    this.app.listen(this.port, () => {
      console.log(`App is running on port ::${this.port}`);
    });
  }
}

function runApp() {
  new App();
}

runApp();
