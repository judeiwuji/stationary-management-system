import { Application } from "express";
import express from "express";
import * as dotEnv from "dotenv";
import db from "./models/engine/sequelize";
import { Roles } from "./models/role";
dotEnv.config();

class App {
  app!: Application;
  port!: string;

  constructor() {
    this.app = express();
    this.port = `${process.env.PORT}`;
    db.sync({ alter: false });

    this.settings();
    this.run();
  }

  settings() {}

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
