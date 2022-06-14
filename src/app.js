import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { customlimiter } from "./middlewares/rateLimiting"
// import { graphqlHTTP } from "express-graphql"
// import { NODE_ENV } from "./config"
// import schemas from "./graphQl/schemas"
// import { AUTH_CLIENT_ID, MAX_API_REQUEST } from "./config"
import authenticateUsers from "./routes/auth"
import templatesRoute from "./routes/templates"


const app = express()

// Middlewares
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: false }))

// router  middlewares

app.use(customlimiter)

// user
app.use("/api/auth", authenticateUsers)

// templates
app.use("/api/templates", templatesRoute)
// // tasks
// app.use("/api/tasks", addTasks)
// app.use("/api/tasks", getTasks)
// app.use("/api/tasks", completeTask)
// // exams timer
// app.use("/api/exams/timer/", addExamTime)
// app.use("/api/exams/timer/", getExamsTime)
// app.use("/api/exams/timer/", deleteExamTime)


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server listening @ http://localhost:${PORT}`);
})
