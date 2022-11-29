import { ApolloServer } from 'apollo-server-micro'
import { typeDefs } from '../../graphql/schemas'
import resolvers from '../../graphql/resolvers'
import { MicroRequest } from 'apollo-server-micro/dist/types'
import { ServerResponse, IncomingMessage } from 'http'
import { verifyToken } from '../../utils'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization
    const user = verifyToken(token)
    return user
  },
})

const startServer = apolloServer.start()

export default async function handler(
  req: MicroRequest,
  res: ServerResponse<IncomingMessage>,
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com',
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }
  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
