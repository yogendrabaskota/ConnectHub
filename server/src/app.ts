import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig";
dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

export default app;
