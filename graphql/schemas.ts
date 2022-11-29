import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type ResponsePayload {
    token: String
    user: User
    message: String
  }

  type Organisation {
    id: ID!
    created_at: String
    name: String
    members: [Employee]
    owner: User
    owner_id: String
  }

  type Employee {
    id: ID!
    created_at: String
    email: String
    name: String
    role: String
    organisation: Organisation
    organisation_id: String
  }

  type User {
    id: ID!
    name: String
    email: String
    created_at: String
    organisations: [Organisation]
  }

  type Query {
    getAuthUser: User
    getOrganisation(id: ID!): Organisation
  }

  type Mutation {
    signup(name: String, password: String, email: String): ResponsePayload
    login(email: String, password: String): ResponsePayload
    # organisation
    createOrganisation(name: String!): Organisation
    deleteOrganisation(id: ID!): ResponsePayload
    updateOrganisation(id: ID!, name: String): ResponsePayload
    # employee
    addEmployee(
      name: String
      role: String
      email: String
      organisation_id: String
    ): Employee
    updateEmployee(
      name: String
      role: String
      email: String
      id: String
    ): ResponsePayload
    deleteEmployee(id: String): ResponsePayload
  }
`
