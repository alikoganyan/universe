
export const SET_USERID = 'SET_USERID'
export const SET_ALL_USERS = 'SET_ALL_USERS'
export const REGISTER_USER = 'REGISTER_USER'
export const setUser = (payload) => {
    return ({
        type: SET_USERID,
        payload
    })
}
export const setAllUsers = (payload) => {
    return ({
        type: SET_ALL_USERS,
        payload
    })
}
export const registerUser = (payload) => {
    return ({
        type: REGISTER_USER,
        payload
    })
}