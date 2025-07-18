const express = require("express");
const dotenv = require("dotenv").config();

const app = express();

app.use("/", (req, res) => {
  res.send("Server is running!");
});
app.use("/api/chat", async (req, res) => {
  res.send("These are data");
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
