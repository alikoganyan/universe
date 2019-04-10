
export const SET_USERID = 'SET_USERID'
export const SET_ALL_USERS = 'SET_ALL_USERS'
export const REGISTER_USER = 'REGISTER_USER'
export const SET_USER = 'SET_USER'
export const SET_AUTH = 'SET_AUTH'

export const setUser = (payload) => {
    return ({
        type: SET_USER,
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


export const setAuth = payload => ({
    type: SET_AUTH,
    payload
})
