
export const SET_USERID = 'SET_USERID'
export const setUser = ( payload ) => {
    return ({
        type: SET_USERID,
        payload: payload
    })
}
