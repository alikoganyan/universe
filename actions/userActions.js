export const SET_USERID = 'SET_USERID'
export const setUserId = ({ payload }) => {
    return ({
        type: SET_USERID,
        payload: payload
    })
}
