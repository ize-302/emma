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
  HStack,
  Button,
  Spinner,
  Box,
} from '@chakra-ui/react'
import { Organisation } from '@prisma/client'
import { formatDate } from '../utils'
import CreateOrg from './CreateOrg'
import DeleteOrganisation from './DeleteOrganisation'
import EditOrganisation from './EditOrganisation'
import NextLink from 'next/link'

interface OrganisationsTableProps {
  organisations: [Organisation]
  refetch: () => void
  loading: boolean
}

const OrganisationsTable: React.FC<OrganisationsTableProps> = ({
  organisations,
  refetch,
  loading,
}) => {
  return (
    <>
      <HStack justifyContent={'space-between'} mb={5}>
        <Heading pl={5} fontSize="20px" textTransform={'capitalize'}>
          Organisations ({organisations?.length})
        </Heading>
        <CreateOrg refetch={refetch} />
      </HStack>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {organisations?.length > 0 ? (
            <>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Members</Th>
                      <Th>Created at</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {organisations?.map((organisation: Organisation) => (
                      <Tr key={organisation.id} _hover={{ bg: '#eee' }}>
                        <Td>
                          <Button
                            as={NextLink}
                            href={`/organisations/${organisation.id}`}
                            color="blue.400"
                            variant={'link'}
                          >
                            {organisation.name}
                          </Button>
                        </Td>
                        <Td>{organisation?.members?.length}</Td>
                        <Td>{formatDate(organisation?.created_at)}</Td>
                        <Td>
                          <HStack gap={5}>
                            <DeleteOrganisation
                              organisation={organisation}
                              refetch={refetch}
                            />
                            <EditOrganisation
                              organisation={organisation}
                              refetch={refetch}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box pl={5}>You have not created any Organisation</Box>
          )}
        </>
      )}
    </>
  )
}

export default OrganisationsTable
