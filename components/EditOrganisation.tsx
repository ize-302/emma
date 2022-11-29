import React from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  useToast,
  useDisclosure,
  Icon,
  HStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  Heading,
  Spinner,
} from '@chakra-ui/react'
import { FiEdit } from 'react-icons/fi'
import { gql, useMutation } from '@apollo/client'
import { Organisation } from '@prisma/client'
import { useFormik } from 'formik'
import { createOrganisationSchema } from '../lib/form-schemas'

const UPDATE_ORGANISATION = gql`
  mutation UpdateOrganisation($id: ID!, $name: String!) {
    updateOrganisation(id: $id, name: $name) {
      message
    }
  }
`

interface UpdateOrganisationProps {
  organisation: Organisation
  refetch: () => void
}

const UpdateOrganisation: React.FC<UpdateOrganisationProps> = ({
  organisation,
  refetch,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      name: organisation.name,
    },
    onSubmit: (values) => {
      updateOrganisation({
        variables: { id: organisation.id, name: values.name },
      })
    },
    validationSchema: createOrganisationSchema,
  })

  const [updateOrganisation, { loading }] = useMutation(UPDATE_ORGANISATION, {
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
        title: data.updateOrganisation.message,
        status: 'success',
        duration: 3000,
        position: 'top',
      })
      onToggle()
      refetch()
    },
  })

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button p={1} onClick={onToggle}>
          <Icon as={FiEdit} color="green" />
        </Button>
      </PopoverTrigger>
      <PopoverContent maxW="300px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Update organisation</PopoverHeader>
        <PopoverBody>
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              isInvalid={
                formik.touched.name && formik?.errors?.name ? true : false
              }
            >
              <FormLabel htmlFor="name">Organisation name</FormLabel>
              <Input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>
            <Button isLoading={loading} type="submit" w="100%" mt={2}>
              update organisation
            </Button>
          </form>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default UpdateOrganisation
