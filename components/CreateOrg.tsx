import * as React from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  Text,
  Grid,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  useToast,
  Heading,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { createOrganisationSchema } from '../lib/form-schemas'
import { gql, useMutation } from '@apollo/client'

const CREATE_ORGANISATION = gql`
  mutation CreateOrganisation($name: String!) {
    createOrganisation(name: $name) {
      id
      name
    }
  }
`

interface CreateOrgProps {
  refetch: () => void
}

const CreateOrg: React.FC<CreateOrgProps> = ({ refetch }) => {
  const toast = useToast()
  const { isOpen, onToggle, onClose } = useDisclosure()

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      createOrganisation({
        variables: { name: values.name },
      })
    },
    validationSchema: createOrganisationSchema,
  })

  const [createOrganisation, { loading }] = useMutation(CREATE_ORGANISATION, {
    onError: (err) => {
      toast({
        title: err?.message,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    },
    onCompleted(data, _clientOptions?) {
      onToggle()
      refetch()
    },
  })

  return (
    <>
      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button size="sm" onClick={onToggle}>
            Add Organisation
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Create organisation</PopoverHeader>
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
                Create organisation
              </Button>
            </form>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default CreateOrg
