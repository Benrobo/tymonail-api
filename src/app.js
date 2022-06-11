import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { customlimiter } from "./middlewares/rateLimiting"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
// import { AUTH_CLIENT_ID, MAX_API_REQUEST } from "./config"

const app = express()

// Middlewares
// app.use(jwtCheck);
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: false }))

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(Auth0Config));

// router  middlewares

app.use(customlimiter)

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => 'Hello world!' };

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

// user
// app.use("/api/v2/auth", registerUser)
// app.use("/api/v2/auth", loginUser)
// // collections
// app.use("/api/v2/collection", createCollection)
// app.use("/api/v2/collection", getCollections)
// // tasks
// app.use("/api/v2/tasks", addTasks)
// app.use("/api/v2/tasks", getTasks)
// app.use("/api/v2/tasks", completeTask)
// // exams timer
// app.use("/api/v2/exams/timer/", addExamTime)
// app.use("/api/v2/exams/timer/", getExamsTime)
// app.use("/api/v2/exams/timer/", deleteExamTime)



const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server listening @ http://localhost:${PORT}`);
})
