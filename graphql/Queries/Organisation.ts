import { Organisation } from '@prisma/client'
import { prisma } from '../../lib/prisma'

const members = async (organisation: Organisation) => {
  return await prisma.employee.findMany({
    where: {
      organisation_id: organisation.id,
    },
  })
}

module.exports = {
  members,
}
