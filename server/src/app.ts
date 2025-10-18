import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";

import userRoutes from "./modules/user/routes/user.route";
import messageRoutes from "./modules/message/routes/message.route";

const app = express();

dotenv.config();

// Connect to Database
connectDB();

// Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Global Error Handler
app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message =
      err.message || "Something went wrong on the server. Please try again.";

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
);

// 404-ERROR Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
