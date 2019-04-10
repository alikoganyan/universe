
export const SET_USERID = 'SET_USERID'
export const SET_ALL_USERS = 'SET_ALL_USERS'
export const REGISTER_USER = 'REGISTER_USER'
export const SET_USER = 'SET_USER'
export const SET_AUTH = 'SET_AUTH'
export const SET_REGISTER_USER_NUMBER = 'SET_REGISTER_USER_NUMBER'
export const SET_REGISTER_USER_SMS = 'SET_REGISTER_USER_SMS'
export const setUser = (payload) => ({
    type: SET_USER,
    payload
})
export const setAllUsers = (payload) => ({
    type: SET_ALL_USERS,
    payload
})
export const registerUser = (payload) => ({
    type: REGISTER_USER,
    payload
})
export const setAuth = payload => ({
    type: SET_AUTH,
    payload
})
export const setRegisterUserNumber = payload => ({
    type: SET_REGISTER_USER_NUMBER,
    payload
})
export const setRegisterUserSms = payload => ({
    type: SET_REGISTER_USER_SMS,
    payload
})
