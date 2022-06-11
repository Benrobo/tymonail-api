import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"

import { projects, users } from './data'


const UserType = new GraphQLObjectType({
    name: "users",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
    })
})


const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return users
            }
        },
        byId: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return users.find(user => user.id === args.id)
            }
        }
    }
})


export default new GraphQLSchema({
    query: RootQuery
})