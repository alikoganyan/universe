export const ADD_MESSAGE = 'ADD_MESSAGE'
export const ADD_GROUP_MESSAGE = 'ADD_GROUP_MESSAGE'
export const START_SEARCH = 'START_SEARCH'
export const STOP_SEARCH = 'STOP_SEARCH'
export const GET_MESSAGES = 'GET_MESSAGES'
export const SET_ROOM = 'SET_ROOM'
export const addMessage = (payload) => {
    return ({
        type: ADD_MESSAGE,
        payload: payload
    })
}
export const startSearch = () => {
    return ({
        type: START_SEARCH
    })
}
export const stopSearch = () => {
    return ({
        type: STOP_SEARCH
    })
}

export const getMessages = (payload) => {
    return ({
        type: GET_MESSAGES,
        payload
    })
}

export const setRoom = (payload) => {
    return ({
        type: SET_ROOM,
        payload
    })
}
