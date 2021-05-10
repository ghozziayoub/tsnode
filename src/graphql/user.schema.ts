import { hashSync, genSaltSync, compareSync } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { User } from "../mongodb/models/user"

export const types = `
  type User {
    id: ID!
    email: String!
    password: String!
    token: String!
  }
`
export const queries = `
    getUsers: [User]
    getUser(id: ID!): User
`
export const mutations = `
    addUser(email: String!, password: String!): User
    loginUser(email: String!, password: String!): User
    updateUser(email: String, password: String): User
    deleteUser: User
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
    getUsers: async () => {
      try {
        let users = await User.find()
        return users
      } catch (error) {
        return error
      }
    },
    getUser: async (parent: any, args: any) => {
      try {
        let user = await User.findById(args.id)
        if (!user) throw new Error("user not found")

        return user
      } catch (error) {
        return error
      }
    }
  },
  Mutation: {
    addUser: async (parent: any, args: any) => {
      try {
        let user = new User({
          email: args.email,
          password: hashSync(args.password, genSaltSync(10))
        });
        let userFromDb = await user.save()
        return userFromDb
      } catch (error) {
        return error
      }
    },
    loginUser: async (parent: any, args: any) => {
      try {
        let user = await User.findOne({ email: args.email })

        if (!user) throw new Error("user not found")

        else {
          let compare = compareSync(args.password, user.password)
          if (!compare) throw new Error("user not found")
          else {
            let token = sign({ id: user._id }, "SEKRITOU")
            return { token }
          }
        }
      } catch (error) {
        return error
      }
    },
    updateUser: async (parent: any, args: any, context: any) => {
      try {
        let userId = await getUserId(context)
        if (!userId) throw new Error("user not found")

        if (args.password) args.password = hashSync(args.password, genSaltSync(10))
        let userFromDb = User.findOneAndUpdate({ _id: userId }, args, { new: true })

        return userFromDb
      } catch (error) {
        return error
      }
    },
    deleteUser: async (parent: any, args: any, context: any) => {
      try {
        let userId = await getUserId(context)
        if (!userId) throw new Error("user not found")

        let userFromDb = User.findOneAndDelete({ _id: userId })
        return userFromDb

      } catch (error) {
        return error
      }
    }
  }
}