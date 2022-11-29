import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Icon,
  HStack,
  Button,
  Box,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react'
import { Employee, Organisation } from '@prisma/client'
import { formatDate } from '../utils'
import MemberDrawer from './MemberDrawer'

interface OrganisationTableProps {
  organisation: Organisation
  loading: boolean
  refetch: () => void
}

const OrganisationTable: React.FC<OrganisationTableProps> = ({
  organisation,
  loading,
  refetch,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedMember, setselectedMember] = React.useState<any>(null)

  return (
    <>
      <HStack justifyContent={'space-between'} mb={5}>
        <Heading pl={5} fontSize="20px" textTransform={'capitalize'}>
          {organisation?.name} ({organisation?.members?.length} members)
        </Heading>
        <Button size="sm" onClick={onOpen}>
          Add Member
        </Button>
      </HStack>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {organisation?.members.length > 0 ? (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Created at</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {organisation?.members?.map((member: Employee) => (
                    <Tr
                      _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                      key={member.id}
                      onClick={() => {
                        setselectedMember(member)
                        onOpen()
                      }}
                    >
                      <Td>{member.name}</Td>
                      <Td>{member.email}</Td>
                      <Td>{member.role || '-'}</Td>
                      <Td>{formatDate(member?.created_at)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Box pl={5}>No members for this organisation</Box>
          )}
        </>
      )}
      <MemberDrawer
        member={selectedMember}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={() => {
          onClose()
          setselectedMember(null)
        }}
        refetch={refetch}
        organisation={organisation}
      />
    </>
  )
}

export default OrganisationTable
