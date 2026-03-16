const express = require("express")
const cookieParser = require("cookie-parser");
const app = express()
const router = app.router
const port = 3000
app.use(express.json())
app.use(cookieParser())

const userRouter = require("../backend/routers/users.router")

router.use("/users", userRouter)

app.listen(port, (req, res) => {
    console.log("app listening on port: "+port)
})