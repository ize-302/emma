import React from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { gql, useQuery } from '@apollo/client'
import OrganisationsTable from '../../components/OrganisationsTable'

const GET_AUTH_USER = gql`
  query Query {
    getAuthUser {
      id
      email
      name
      organisations {
        id
        name
        created_at
        members {
          id
        }
      }
    }
  }
`

const Dashboard = () => {
  const { loading, data, refetch } = useQuery(GET_AUTH_USER)

  return (
    <DashboardLayout>
      <OrganisationsTable
        organisations={data?.getAuthUser?.organisations}
        refetch={refetch}
        loading={loading}
      />
    </DashboardLayout>
  )
}

export default Dashboard
