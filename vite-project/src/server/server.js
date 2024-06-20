import { router } from "./routes/todos.js";
import express from "express";
import cors from "cors";
const app = express();

export const createServer = () => {
  app.use(cors());
  app.use(express.json());
  app.use("/api/todos", router);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });
  return app;
};
