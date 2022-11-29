import { prisma } from '../../lib/prisma'
import { ForbiddenError } from 'apollo-server-micro'

// get an organisation
export const getOrganisation = async (
  _parent: any,
  args: any,
  context: any,
) => {
  if (!context.user) return null
  const findOrganisation = await prisma.organisation.findFirst({
    where: { owner_id: context.user.id, id: args.id },
  })
  if (findOrganisation) {
    return findOrganisation
  } else {
    throw new ForbiddenError('Account does not exist')
  }
}
