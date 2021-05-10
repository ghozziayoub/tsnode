import { Todo } from "../mongodb/models/todo"
import { verify } from "jsonwebtoken"
import { User } from "../mongodb/models/user"

export const types = `
type Todo {
  id: ID!
  userId: String!
  user: User
  title: String!
  description: String!
  comment: String
  state: String
}
`
export const queries = `
getTodos: [Todo]
getTodo(id: ID!): Todo
`
export const mutations = `
addTodo(title: String!, description: String!,state: String,comment: String): Todo
updateTodo(id: ID!, title: String, description: String, comment: String, state: String): Todo
shareTodo(id: ID!, userId: String!): Todo
deleteTodo(id: ID!): Todo
`

const getUserId = async (context: any) => {
  try {
    let decodedToken = JSON.stringify(verify(context.headers.authorization, "SEKRITOU"))
    let user = await User.findOne({ _id: JSON.parse(decodedToken).id })
    if (!user) return null
    return user._id
  } catch (error) {
    return error
  }
}

export const resolvers = {
  Query: {
    getTodos: async (parent: any, args: any, context: any) => {
      try {
        let userId = await getUserId(context)
        if (!userId) throw new Error("user not found")

        let todos = await Todo.find({ userId }).populate("user", "-_id -__v -password")
        return todos

      } catch (error) {
        return error
      }
    },
    getTodo: async (parent: any, args: any, context: any) => {
      try {
        let userId = await getUserId(context)
        if (!userId) throw new Error("user not found")

        let todo = await Todo.findOne({ _id: args.id, userId }).populate("user", "-_id -__v -password")
        if (!todo) throw new Error("todo not found")

        return todo

      } catch (error) {
        return error
      }
    }
  },
  Mutation: {
    addTodo: async (parent: any, args: any, context: any) => {

      try {
        let userId = await getUserId(context)
        if (!userId) throw new Error("user not found")

        let todo = new Todo({
          title: args.title,
          description: args.description,
          userId,
          user: userId,
        })

        let TodoFromDb = await todo.save()
        return TodoFromDb
      } catch (error) {
        return error
      }
    },

    updateTodo: async (parent: any, args: any, context: any) => {
      try {
        if (!args.id) throw new Error("todo id is required")

        let userId = await getUserId(context)
        if (!userId) throw new Error("user not found")

        let todoFromDb = await Todo.findOneAndUpdate({ _id: args.id, userId }, args, { new: true })
        if (!todoFromDb) throw new Error("todo not found")

        return todoFromDb
      } catch (error) {
        return error
      }
    },

    shareTodo: async (parent: any, args: any, context: any) => {
      try {
        if (!args.id) throw new Error("todo id is required")
        if (!args.userId) throw new Error("other user id is required")

        let userId = await getUserId(context)
        if (!userId) throw new Error("user not found")

        let todoFromDb = await Todo.findOne({ _id: args.id, userId })
        if (!todoFromDb) throw new Error("todo not found")

        todoFromDb.user = args.userId
        todoFromDb.userId = args.userId
        await todoFromDb.save()

        return todoFromDb
      } catch (error) {
        return error
      }
    },

    deleteTodo: async (parent: any, args: any, context: any) => {
      try {
        if (!args.id) throw new Error("todo id is required")

        let userId = await getUserId(context)
        if (!userId) throw new Error("user not found")

        let todoFromDb = await Todo.findOneAndDelete({ _id: args.id, userId })
        if (!todoFromDb) throw new Error("todo not found")

        return todoFromDb
      } catch (error) {
        return error
      }
    }
  }
}