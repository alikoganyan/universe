export const ADD_TASK_RECEIVER = 'ADD_TASK_RECEIVERS';
export const SET_TASK_RECEIVERS = 'SET_TASK_RECEIVERS';
export const ADD_FEED_RECEIVER = 'ADD_FEED_RECEIVER'
export const SET_FEED_RECEIVERS = 'SET_FEED_RECEIVERS'
export const ADD_DIALOG_PARTICIPANT = 'ADD_DIALOG_PARTICIPANT'
export const SET_DIALOG_PARTICIPANTS = 'SET_DIALOG_PARTICIPANTS'
export const addTaskReceiver = (payload) => ({
    type: ADD_TASK_RECEIVER,
    payload,
})

export const setTaskReceivers = (payload) => ({
    type: SET_TASK_RECEIVERS,
    payload,
})

export const addFeedReceiver = (payload) => ({
    type: ADD_FEED_RECEIVER,
    payload,
})

export const setFeedReceivers = (payload) => ({
    type: SET_FEED_RECEIVERS,
    payload,
})


export const addDialogParticipant = (payload) => ({
    type: ADD_DIALOG_PARTICIPANT,
    payload,
})

export const setDialogParticipants = (payload) => ({
    type: SET_DIALOG_PARTICIPANTS,
    payload,
})
