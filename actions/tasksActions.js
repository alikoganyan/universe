export const ADD_RECEIVER = 'ADD_RECEIVERS';
export const SET_RECEIVERS = 'SET_RECEIVERS';

export const addReceiver = (payload) => ({
    type: ADD_RECEIVER,
    payload,
})

export const setReceivers = (payload) => ({
    type: SET_RECEIVERS,
    payload,
})
