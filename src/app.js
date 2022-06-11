import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { customlimiter } from "./middlewares/rateLimiting"
import { graphqlHTTP } from "express-graphql"
import { NODE_ENV } from "./config"
import schemas from "./graphQl/schemas"
// import { AUTH_CLIENT_ID, MAX_API_REQUEST } from "./config"

const app = express()

// Middlewares
// app.use(jwtCheck);
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: false }))


app.use(customlimiter)


app.use('/graphql', graphqlHTTP({
    schema: schemas,
    // rootValue: root,
    graphiql: NODE_ENV === "development",
}));


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server listening @ http://localhost:${PORT}`);
})
