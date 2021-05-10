import {
    types,
    queries,
    mutations,
    resolvers,
} from "./../src/graphql/user.schema"

describe("User", () => {

    jest.useFakeTimers()
    it('should return all users', async () => {
        const users = resolvers.Query.getUsers()
        expect(users).toBeDefined()
    })

    jest.useFakeTimers()
    it('should return one user by id', async () => {
        const user = resolvers.Query.getUser(null, { id: "609686158d28d61ce05b1136" })
        expect(user).toBeDefined()
    })

})