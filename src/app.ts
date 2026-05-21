import express, { type Application } from "express";
import cors from "cors";
import morgan from "morgan";

const app: Application = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;
