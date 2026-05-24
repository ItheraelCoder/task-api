import express, { type Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { globalErrorHandler } from "@/middlewares/error.middleware";
import authRoutes from "@/routes/aurth.routes";

const app: Application = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);

export default app;
