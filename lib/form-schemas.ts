import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
})

export const signupSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
})

export const createOrganisationSchema = yup.object().shape({
  name: yup.string().required(),
})

export const memberSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().required(),
})
