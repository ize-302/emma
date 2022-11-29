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
} from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'
import { gql, useMutation } from '@apollo/client'
import { Organisation } from '@prisma/client'

const DELETE_ORGANISATION = gql`
  mutation DeleteOrganisation($id: ID!) {
    deleteOrganisation(id: $id) {
      message
    }
  }
`

interface DeleteOrganisationProps {
  organisation: Organisation
  refetch: () => void
}

const DeleteOrganisation: React.FC<DeleteOrganisationProps> = ({
  organisation,
  refetch,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const toast = useToast()

  const [deleteOrganisation, { loading }] = useMutation(DELETE_ORGANISATION, {
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
        title: data.deleteOrganisation.message,
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
          <Icon as={FiTrash2} color="red" />
        </Button>
      </PopoverTrigger>
      <PopoverContent maxW="180px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Confirm delete!</PopoverHeader>
        <PopoverBody as={HStack}>
          <Button
            size="sm"
            bg="red"
            color={'white'}
            onClick={() => {
              deleteOrganisation({
                variables: { id: organisation.id },
              })
            }}
            isLoading={loading}
          >
            Delete
          </Button>
          <Button size="sm" onClick={onToggle}>
            Cancel
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default DeleteOrganisation
