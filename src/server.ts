// import libs
import express from "express";
import cors from "cors"
import { ApolloServer } from "apollo-server-express"

// import schema
import { typeDefs, resolvers } from './graphql/schema'

// import conenction to database
import connectToMongoDB from "./mongodb/config/db"


export default class Server {

    constructor(readonly port: number) { }

    start() {
        const app = express()

        app.use(cors())
        app.use(express.json())
        connectToMongoDB

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => {
                return req
            },
            formatError: (err) => {
                return ({ message: err.message, statusCode: 400 })
            }
        })

        server.applyMiddleware({ app });

        app.listen(this.port, () => {
            console.log(`server started on port ${this.port}!`);
        })
    }
}