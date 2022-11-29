import { prisma } from '../../lib/prisma'
import { ForbiddenError } from 'apollo-server-micro'

// get authed user
export const getAuthUser = async (_parent: any, _args: any, context: any) => {
  if (!context.user) return null
  const findUser = await prisma.user.findFirst({
    where: { id: context.user.id },
  })
  if (findUser) {
    return findUser
  } else {
    throw new ForbiddenError('Account does not exist')
  }
}
