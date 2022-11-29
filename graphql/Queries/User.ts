import { User } from '@prisma/client'
import { prisma } from '../../lib/prisma'

const organisations = async (user: User) => {
  return await prisma.organisation.findMany({
    where: {
      owner_id: user.id,
    },
  })
}

module.exports = {
  organisations,
}
