import * as React from 'react'
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  IconButton,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useToast,
  FormErrorMessage,
  Text,
  Link,
} from '@chakra-ui/react'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { useFormik } from 'formik'
import { gql, useMutation } from '@apollo/client'
import { loginSchema } from '../lib/form-schemas'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import NextLink from 'next/link'

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        email
        id
        name
        created_at
      }
      token
    }
  }
`

const LoginPage = () => {
  const { isOpen, onToggle } = useDisclosure()
  const toast = useToast()

  const [login, { loading }] = useMutation(LOGIN_USER, {
    onError: (err) => {
      toast({
        title: err?.message,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    },
    onCompleted(data, _clientOptions?) {
      const { login } = data
      Cookies.set('access_token', login?.token)
      window.location.href = '/organisations'
    },
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login({
        variables: { email: values.email, password: values.password },
      })
    },
  })

  return (
    <Layout>
      <Container maxW="md" display="grid" pt={40}>
        <Box width="100%">
          <Heading fontSize={'2xl'} textAlign={'center'} mb={10}>
            Log in
          </Heading>

          <Box
            p={5}
            bg="white"
            boxShadow="sm"
            border="1px solid #eee"
            rounded="md"
          >
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl
                    isInvalid={
                      formik.touched.email && formik?.errors?.email
                        ? true
                        : false
                    }
                  >
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>
                  {/* password */}
                  <FormControl
                    isInvalid={
                      formik.touched.password && formik?.errors?.password
                        ? true
                        : false
                    }
                  >
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <InputGroup>
                      <InputRightElement>
                        <IconButton
                          variant="link"
                          aria-label={
                            isOpen ? 'Mask password' : 'Reveal password'
                          }
                          icon={isOpen ? <HiEyeOff /> : <HiEye />}
                          onClick={() => onToggle()}
                        />
                      </InputRightElement>
                      <Input
                        id="password"
                        name="password"
                        type={isOpen ? 'text' : 'password'}
                        autoComplete="current-password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {formik.errors.password}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
                <HStack>
                  <Text>Dont have an account?</Text>
                  <Button
                    as={NextLink}
                    href="/signup"
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                  >
                    Sign up
                  </Button>
                </HStack>
                <Stack spacing="6">
                  <Button isLoading={loading} type="submit">
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}

export default LoginPage
