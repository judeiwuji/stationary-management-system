import { Application } from "express";
import express from "express";
import * as dotEnv from "dotenv";
import db from "./models/engine/sequelize";
import RouteManager from "./routes/routemanager";
dotEnv.config();

class App {
  app!: Application;
  port!: string;

  constructor() {
    this.app = express();
    this.port = `${process.env.PORT}`;
    db.sync({ alter: false });
    this.middlewares();
    this.settings();
    this.run();
  }

  middlewares() {
    this.app.use(express.json({}));
    this.app.use(express.urlencoded({ extended: true }));
  }

  settings() {
    new RouteManager(this.app);
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
