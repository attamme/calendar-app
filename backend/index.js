const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

const userRouter = require("./routers/users.router");
const calRouter = require("./routers/calendars.router");
const expRouter = require("./routers/experience.router");

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/calendars", calRouter);
app.use("/experiences", expRouter);

app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});
