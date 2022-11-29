import * as React from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import OrganisationTable from '../../components/OrganisationTable'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

const GET_ORGANISATION = gql`
  query Query($id: ID!) {
    getOrganisation(id: $id) {
      name
      id
      members {
        created_at
        email
        id
        name
        role
      }
    }
  }
`
const OrganisationPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { loading, data, refetch } = useQuery(GET_ORGANISATION, {
    variables: { id },
  })

  return (
    <DashboardLayout>
      <OrganisationTable
        organisation={data?.getOrganisation}
        loading={loading}
        refetch={refetch}
      />
    </DashboardLayout>
  )
}

export default OrganisationPage
