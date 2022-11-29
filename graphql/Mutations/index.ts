import { signup, login } from './auth.mutations'
import {
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
} from './organisation.mutations'
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from './employee.mutations'

module.exports = {
  signup,
  login,
  // organisation
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
  // employee
  addEmployee,
  updateEmployee,
  deleteEmployee,
}
