const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const userRouter = require("./routers/users.router");
const calendarRouter = require("./routers/calendars.router");
const itemRouter = require("./routers/items.router");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, ngrok-skip-browser-warning"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "adhd-calendar-api",
    now: new Date().toISOString(),
  });
});

app.use("/users", userRouter);
app.use("/calendars", calendarRouter);
app.use("/items", itemRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`ADHD Calendar API listening on port ${port}`);
});

module.exports = app;
