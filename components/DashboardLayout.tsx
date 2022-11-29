import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import {
  Container,
  Box,
  HStack,
  Text,
  Button,
  Heading,
  Spinner,
} from '@chakra-ui/react'
import Layout from './Layout'
import NextLink from 'next/link'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const GET_AUTH_USER = gql`
  query Query {
    getAuthUser {
      id
      email
      name
    }
  }
`

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('access_token')
    router.push('/')
  }

  const { loading, data } = useQuery(GET_AUTH_USER)

  return (
    <Layout>
      <Container maxW="1200px">
        <HStack
          borderBottom="1px solid #eee"
          py={4}
          px={4}
          justifyContent="space-between"
          mb={5}
        >
          <Heading fontSize="lg" as={NextLink} href="/organisations">
            EMMA!
          </Heading>
          <HStack gap={1}>
            {loading ? <Spinner /> : <Text>{data?.getAuthUser?.name}</Text>}
            <Button size="sm" onClick={() => handleLogout()}>
              Logout
            </Button>
          </HStack>
        </HStack>
        <Box>{children}</Box>
      </Container>
    </Layout>
  )
}

export default DashboardLayout
