import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
const app = express();

dotenv.config();

connectDB();

app.use(helmet());
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

import userRoutes from "./modules/user/routes/userRoute";

app.use("/api/users", userRoutes);

export default app;
