import { Application } from "express";

export default interface IRoute {
  routes(): void;
}
