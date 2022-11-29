import { AuthenticationError, UserInputError } from 'apollo-server-micro'
import { prisma } from '../../lib/prisma'
import { updateAuthUser } from './user.mutations'

// create organisation
export const createOrganisation = async (
  _parent: any,
  args: any,
  context: any,
) => {
  const { name } = args
  const { user } = context
  if (!name) {
    throw new UserInputError('All input fields are important')
  }
  // check if organisation with same name exists
  const findOrganisation = await prisma.organisation.findFirst({
    where: { name },
  })
  if (findOrganisation) {
    throw new AuthenticationError(
      `Organisation with name '${name}' already exists`,
    )
  } else {
    const created_organisation = await prisma.organisation.create({
      data: {
        name,
        owner_id: user.id,
      },
    })
    return created_organisation
  }
}

// update organisation
export const updateOrganisation = async (
  _parent: any,
  args: any,
  context: any,
) => {
  const { id, name } = args
  const { user } = context
  const findOrganisation = await prisma.organisation.findFirst({
    where: { id },
  })
  if (!findOrganisation) {
    throw new AuthenticationError(`Organisation not found`)
  }
  if (findOrganisation?.owner_id === user.id) {
    await prisma.organisation.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })
    return {
      message: 'Organisation has been updated',
    }
  } else {
    throw new AuthenticationError(
      `Organisation with name '${findOrganisation?.name}' does not belong to you`,
    )
  }
}

// delete organisation
export const deleteOrganisation = async (
  _parent: any,
  args: any,
  context: any,
) => {
  const { id } = args
  const { user } = context
  const findOrganisation = await prisma.organisation.findFirst({
    where: { id },
  })
  if (!findOrganisation) {
    throw new AuthenticationError(`Organisation not found`)
  }
  if (findOrganisation?.owner_id === user.id) {
    await prisma.organisation.delete({
      where: {
        id,
      },
    })
    return {
      message: 'Organisation has been deleted',
    }
  } else {
    throw new AuthenticationError(
      `Organisation with name '${findOrganisation?.name}' does not belong to you`,
    )
  }
}
