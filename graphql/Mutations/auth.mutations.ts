import { AuthenticationError, UserInputError } from 'apollo-server-micro'
const bcrypt = require('bcrypt')
import { generateToken } from '../../utils'
import { prisma } from '../../lib/prisma'

// signup: add user
export const signup = async (_parent: any, args: any) => {
  const { name, email, password } = args
  if (!name || !email || !password) {
    throw new UserInputError('All input fields are important')
  }
  // check if email is already in use
  const findUser = await prisma.user.findUnique({
    where: { email: args.email },
  })
  if (findUser) {
    throw new AuthenticationError('Email address is already in use')
  }
  const encrypt_password = bcrypt.hashSync(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: encrypt_password,
    },
  })
  const token = generateToken(user)
  return {
    token: token,
    user: user,
  }
}

//  login: sign in user
export const login = async (_parent: any, args: any) => {
  const findUser = await prisma.user.findUnique({
    where: { email: args.email },
  })
  if (!findUser) throw new AuthenticationError('Invalid login details')
  if (bcrypt.compareSync(args.password.toLowerCase(), findUser.password)) {
    const token = await generateToken(findUser)

    return {
      token: token,
      user: findUser,
      message: 'Sign in successful!',
    }
  } else {
    throw new AuthenticationError('Invalid login details')
  }
}

// change authenticated user password
export const changePassword = async (_parent: any, args: any, context: any) => {
  const { user } = context
  const { password, new_password } = args
  const findUser = await prisma.user.findUnique({
    where: { id: user.id },
  })
  if (!bcrypt.compareSync(password, findUser?.password)) {
    throw new UserInputError('current password incorrect')
  }
  const encrypt_password = bcrypt.hashSync(new_password, 10)
  // update password
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: encrypt_password,
    },
  })

  return { message: 'Password has been successfully updated' }
}
