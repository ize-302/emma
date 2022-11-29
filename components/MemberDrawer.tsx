import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  HStack,
  FormControl,
  FormLabel,
  Stack,
  Input,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { memberSchema } from '../lib/form-schemas'
import { gql, useMutation } from '@apollo/client'
import { Organisation } from '@prisma/client'

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $email: String!
    $name: String!
    $role: String!
    $organisation_id: String!
  ) {
    addEmployee(
      email: $email
      name: $name
      role: $role
      organisation_id: $organisation_id
    ) {
      created_at
      email
      id
      name
      role
    }
  }
`

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $email: String!
    $name: String!
    $role: String!
    $id: String!
  ) {
    updateEmployee(email: $email, name: $name, role: $role, id: $id) {
      message
    }
  }
`

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: String!) {
    deleteEmployee(id: $id) {
      message
    }
  }
`

interface MemberDrawerProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  member: any
  refetch: () => void
  organisation: Organisation
}

const MemberDrawer: React.FC<MemberDrawerProps> = ({
  member,
  isOpen,
  onOpen,
  onClose,
  refetch,
  organisation,
}) => {
  const toast = useToast()

  const [addEmployee, { loading }] = useMutation(ADD_EMPLOYEE, {
    onError: (err) => {
      toast({
        title: err?.message,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    },
    onCompleted(data, _clientOptions?) {
      toast({
        title: 'Employee successfully added',
        status: 'success',
        duration: 3000,
        position: 'top',
      })
      refetch()
      onClose()
    },
  })

  const [updateEmployee, updateQuery] = useMutation(UPDATE_EMPLOYEE, {
    onError: (err) => {
      toast({
        title: err?.message,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    },
    onCompleted(data, _clientOptions?) {
      toast({
        title: data.updateEmployee.message,
        status: 'success',
        duration: 3000,
        position: 'top',
      })
      refetch()
      onClose()
    },
  })

  const [deleteEmployee, deleteQuery] = useMutation(DELETE_EMPLOYEE, {
    onError: (err) => {
      toast({
        title: err?.message,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    },
    onCompleted(data, _clientOptions?) {
      toast({
        title: data.deleteEmployee.message,
        status: 'success',
        duration: 3000,
        position: 'top',
      })
      refetch()
      onClose()
    },
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: member?.name || '',
      email: member?.email || '',
      role: member?.role || '',
    },
    onSubmit: (values) => {
      if (member) {
        updateEmployee({
          variables: {
            id: member.id,
            email: values.email,
            name: values.name,
            role: values.role,
          },
        })
      } else {
        addEmployee({
          variables: {
            email: values.email,
            name: values.name,
            role: values.role,
            organisation_id: organisation.id,
          },
        })
      }
    },
    validationSchema: memberSchema,
  })
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxW={'500px'}>
        <DrawerCloseButton />
        <DrawerHeader>
          {!member ? <>Add a member</> : <>Edit a member</>}
        </DrawerHeader>

        <form onSubmit={formik.handleSubmit}>
          <DrawerBody>
            <Stack spacing="5">
              {/* email */}
              <FormControl
                isInvalid={
                  formik.touched.email && formik?.errors?.email ? true : false
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
              {/* name */}
              <FormControl
                isInvalid={
                  formik.touched.name && formik?.errors?.name ? true : false
                }
              >
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              </FormControl>
              {/* role */}
              <FormControl
                isInvalid={
                  formik.touched.role && formik?.errors?.role ? true : false
                }
              >
                <FormLabel htmlFor="role">Role</FormLabel>
                <Input
                  id="role"
                  name="role"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.role}
                />
                <FormErrorMessage>{formik.errors.role}</FormErrorMessage>
              </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter as={HStack}>
            {member && (
              <Button
                width="full"
                variant="outline"
                mr={3}
                isLoading={deleteQuery.loading}
                onClick={() => {
                  deleteEmployee({
                    variables: {
                      id: member.id,
                    },
                  })
                }}
              >
                Delete
              </Button>
            )}
            <Button
              isLoading={member ? updateQuery?.loading : loading}
              type="submit"
              width="full"
              colorScheme="blue"
            >
              {member ? 'Update' : 'Create'}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

export default MemberDrawer
