import { AuthenticationError } from 'apollo-server-micro'
import { prisma } from '../../lib/prisma'

// update authenticated user
export const addEmployee = async (_parent: any, args: any, context: any) => {
  const { user } = context
  if (user) {
    const employeeExists = await prisma.employee.findFirst({
      where: {
        email: args.email,
      },
    })
    if (employeeExists) {
      throw new AuthenticationError(
        `Employee with email ${args.email} already exists`,
      )
    }
    return await prisma.employee.create({
      data: args,
    })
  } else {
    throw new AuthenticationError(`You are not authorised to add a member`)
  }
}

export const updateEmployee = async (_parent: any, args: any, context: any) => {
  const { user } = context
  if (user) {
    await prisma.employee.update({
      where: {
        id: args.id,
      },
      data: {
        name: args.name,
        role: args.role,
        email: args.email,
      },
    })
    return {
      message: 'Employee has been updated',
    }
  } else {
    throw new AuthenticationError(`You are not authorised to update a member`)
  }
}

export const deleteEmployee = async (_parent: any, args: any, context: any) => {
  const { user } = context
  if (user) {
    await prisma.employee.delete({
      where: {
        id: args.id,
      },
    })
    return {
      message: 'Employee has been deleted',
    }
  } else {
    throw new AuthenticationError(`You are not authorised to update a member`)
  }
}
