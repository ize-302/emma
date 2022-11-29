import React from 'react'
import Cookies from 'js-cookie'
import { verifyToken } from '../utils'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: React.ReactNode
}

const protectedRoutes = ['/organisations', '/organisations/[id]']

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const access_token = Cookies.get('access_token')
  const isValidToken = verifyToken(access_token)
  const router = useRouter()

  React.useEffect(() => {
    if (isValidToken) {
      if (!protectedRoutes.includes(router.route)) {
        router.push('/organisations')
      }
    } else if (!isValidToken && protectedRoutes.includes(router.route)) {
      Cookies.remove('access_token')
      router.push('/')
    }
  }, [router, access_token, isValidToken])

  return <>{children}</>
}

export default Layout
