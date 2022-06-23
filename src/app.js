import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { customlimiter } from "./middlewares/rateLimiting"
// import { graphqlHTTP } from "express-graphql"
// import { NODE_ENV } from "./config"
// import schemas from "./graphQl/schemas"
// import { AUTH_CLIENT_ID, MAX_API_REQUEST } from "./config"
import authenticateUsers, { getAllUsers, getUser } from "./routes/auth"
import templatesRoute from "./routes/templates"
import templatesFormRoute from './routes/form'
import feedbackRoutes from './routes/feedbacks'


const app = express()
const route = express.Router()

// Middlewares
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(customlimiter)

route.get("/", (req, res) => {
    return res.send(`
        <p>Hi There, welcome to tymonial.</p>
    `)
})

// user
app.use("/api/auth", authenticateUsers)
// fetching users
app.use("/api", getUser)
app.use("/api", getAllUsers)

// templates
app.use("/api/templates", templatesRoute)

// template form
app.use("/api/templates/form", templatesFormRoute)

// feedbacks
app.use("/api/feedbacks", feedbackRoutes)



const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server listening @ http://localhost:${PORT}`);
})
