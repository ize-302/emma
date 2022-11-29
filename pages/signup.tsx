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
} from '@chakra-ui/react'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { useFormik } from 'formik'
import { gql, useMutation } from '@apollo/client'
import { signupSchema } from '../lib/form-schemas'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import NextLink from 'next/link'

const SIGNUP_USER = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        email
        id
        name
      }
    }
  }
`

const SignupPage = () => {
  const { isOpen, onToggle } = useDisclosure()
  const toast = useToast()

  const [signup, { loading }] = useMutation(SIGNUP_USER, {
    onError: (err) => {
      toast({
        title: err?.message,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    },
    onCompleted(data, _clientOptions?) {
      const { signup } = data
      Cookies.set('access_token', signup?.token)
      window.location.href = '/organisations'
    },
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: signupSchema,
    onSubmit: (values) => {
      signup({
        variables: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      })
    },
  })

  return (
    <Layout>
      <Container maxW="md" display="grid" pt={40}>
        <Box width="100%">
          <Heading fontSize={'2xl'} textAlign={'center'} mb={10}>
            Signup
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
                      formik.touched.name && formik?.errors?.name ? true : false
                    }
                  >
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                      id="name"
                      name="name"
                      type="name"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                    />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                  </FormControl>
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
                  <Text>Already have an account?</Text>
                  <Button
                    as={NextLink}
                    href="/login"
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                  >
                    Sign in
                  </Button>
                </HStack>
                <Stack spacing="6">
                  <Button isLoading={loading} type="submit">
                    Sign up
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

export default SignupPage
