const Query = require('../Queries')
const Mutation = require('../Mutations')
const User = require('../Queries/User')
const Organisation = require('../Queries/Organisation')

const resolvers = {
  Query,
  Mutation,
  // nested query data
  User,
  Organisation,
}

export default resolvers
