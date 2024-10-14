import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";

import envConfig from "./config/env.config";
import { connection } from "./config/db.config";
import router from "./routes";
import errorHandler from "./middleware/errorHandler";

const { PORT } = envConfig;

class App {
  private app: Application;
  private server: http.Server;
  private corsOrigin: string | string[] | undefined;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.configureMiddleware();
    this.configureRoutes();
    this.connectDB().then(() => {
      this.startServer();
    });
  }

  private configureMiddleware() {
    this.app.use(cors({ origin: this.corsOrigin }));
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: false, limit: "50mb" }));
    this.app.use(morgan("dev"));
  }

  private configureRoutes() {
    this.app.use("/api", router);
    this.app.get("/", (_req: Request, res: Response) => {
      res.send("API running");
    });
    this.app.all("*", (_req: Request, res: Response) => {
      res
        .status(404)
        .json({ message: "Requested route not found", data: null });
    });
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      errorHandler(err, req, res, next);
    });
  }

  private async connectDB() {
    await connection();
  }

  private startServer() {
    this.server.listen(PORT, () => {
      console.log(`Server is now running on http://localhost:${PORT}`);
    });
  }
}

new App();
