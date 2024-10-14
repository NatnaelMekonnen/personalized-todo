import { Router } from "express";
import taskRouter from "./task.routes";

const v1Router = Router();

v1Router.use("task", taskRouter);

export default v1Router;
