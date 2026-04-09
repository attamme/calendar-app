const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

const userRouter = require("./routers/users.router");
const calRouter = require("./routers/calendars.router");
const expRouter = require("./routers/experience.router");

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  const requestedHeaders = req.headers["access-control-request-headers"];

  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Vary", "Origin");
  res.header(
    "Access-Control-Allow-Headers",
    requestedHeaders || "Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning",
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/users", userRouter);
app.use("/calendars", calRouter);
app.use("/experiences", expRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`app listening on port: ${port}`);
});
