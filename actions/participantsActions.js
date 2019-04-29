export const ADD_TASK_RECEIVER = 'ADD_TASK_RECEIVERS';
export const SET_TASK_RECEIVERS = 'SET_TASK_RECEIVERS';
export const ADD_DIALOG_PARTICIPANT = 'ADD_DIALOG_PARTICIPANT'
export const addTaskReceiver = (payload) => ({
    type: ADD_TASK_RECEIVER,
    payload,
})

export const setTaskReceivers = (payload) => ({
    type: SET_TASK_RECEIVERS,
    payload,
})

export const addDialogParticipant = (payload) => ({
    type: ADD_DIALOG_PARTICIPANT,
    payload,
})
