import { gql } from "apollo-server-express"

import {
    types as userTypes,
    queries as userQuerys,
    mutations as userMutations,
    resolvers as userResolvers
} from "./user.schema"

import {
    types as todoTypes,
    queries as todoQuerys,
    mutations as todoMutations,
    resolvers as todoResolvers
} from "./todo.schema"

// global typeDefs
export const typeDefs = gql`
   ${userTypes}
   ${todoTypes}

   type Query {
    ${userQuerys}
    ${todoQuerys}
   }

   type Mutation {
    ${userMutations}
    ${todoMutations}
   }
`

// global reslovers
export const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...todoResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...todoResolvers.Mutation
    }
}