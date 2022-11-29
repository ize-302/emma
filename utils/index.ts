import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export function generateToken(user: User) {
  try {
    return jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
        },
      },
      `${process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET}`,
      { expiresIn: '1h', algorithm: 'HS256' },
    )
  } catch (e) {
    console.log('e:', e)
    return null
  }
}

export function verifyToken(token: any) {
  try {
    return jwt.verify(token, `${process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET}`)
  } catch (e) {
    console.log('e:', e)
    return null
  }
}

export function formatDate(timestamp: string) {
  return dayjs(new Date(parseInt(timestamp))).format('DD, MMM YYYY')
}
