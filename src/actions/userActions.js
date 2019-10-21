export const SET_USERID = 'SET_USERID'
export const SET_ALL_USERS = 'SET_ALL_USERS'
export const REGISTER_USER = 'REGISTER_USER'
export const SET_USER = 'SET_USER'
export const SET_AUTH = 'SET_AUTH'
export const SET_REGISTER_USER_NUMBER = 'SET_REGISTER_USER_NUMBER'
export const SET_REGISTER_USER_SMS = 'SET_REGISTER_USER_SMS'
export const SET_CONTACTS = 'SET_CONTACTS'
export const SET_ERROR = 'SET_ERROR'
export const ALTER_USER = 'ALTER_USER'
export const SET_SETTINGS = 'SET_SETTINGS'
export const SET_COMPANIES = 'SET_COMPANIES'

export const setUser = payload => ({
  type: SET_USER,
  payload,
})
export const setAllUsers = payload => ({
  type: SET_ALL_USERS,
  payload,
})
export const registerUser = payload => ({
  type: REGISTER_USER,
  payload,
})
export const setAuth = payload => ({
  type: SET_AUTH,
  payload,
})
export const setError = payload => ({
  type: SET_ERROR,
  payload,
})
export const setRegisterUserNumber = payload => ({
  type: SET_REGISTER_USER_NUMBER,
  payload,
})
export const setRegisterUserSms = payload => ({
  type: SET_REGISTER_USER_SMS,
  payload,
})
export const setContacts = payload => ({
  type: SET_CONTACTS,
  payload,
})
export const alterUser = payload => ({
  type: ALTER_USER,
  payload,
})
export const setSettings = payload => ({
  type: SET_SETTINGS,
  payload,
})

export const setCompanies = payload => ({
  type: SET_COMPANIES,
  payload,
})
