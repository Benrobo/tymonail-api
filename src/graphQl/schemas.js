import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"

import { templates, users } from './data'


const UserType = new GraphQLObjectType({
    name: "users",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        mail: { type: GraphQLString },
        role: { type: GraphQLString },
    })
})

const ProjectType = new GraphQLObjectType({
    name: "templates",
    fields: () => ({
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
        name: { type: GraphQLString },
        // for relationship
        users: {
            type: UserType,
            resolve(parent, args) {
                return users.find(user => user.id === parent.userId)
            }
        }
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
        templates: {
            type: new GraphQLList(ProjectType),
            resolve() {
                return templates
            }
        },
        userbyId: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return users.find(user => user.id === args.id)
            }
        },
        templatebyId: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return templates.find(temp => temp.id === args.id)
            }
        }
    }
})

// mutations

const Mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                name: { type: GraphQLString },
                name: { type: GraphQLString }
            }
        }
    }
})


export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})