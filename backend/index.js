const express = require("express")
const cookieParser = require("cookie-parser");
const app = express()
const router = app.router
const port = 3000
app.use(express.json())
app.use(cookieParser())

const userRouter = require("../backend/routers/users.router")
const calRouter = require("../backend/routers/calendars.router")
const expRouter = require("../backend/routers/experience.router")

router.use("/users", userRouter)
router.use("/calendars", calRouter)
router.use("/experiences", expRouter)

app.listen(port, (req, res) => {
    console.log("app listening on port: "+port)
})