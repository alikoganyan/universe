export const SET_TASKS = 'SET_TASKS';
export const SET_TASK = 'SET_TASK';
export const SET_INC_TASK = 'SET_INC_TASK';
export const SET_OUT_TASK = 'SET_OUT_TASK';
export const setTasks = (payload) => ({
    type: SET_TASKS,
    payload,
})

export const setTask = (payload) => ({
    type: SET_TASK,
    payload,
})

export const setIncTasks = (payload) => ({
    type: SET_INC_TASK,
    payload
})
export const setOutTasks = (payload) => ({
    type: SET_OUT_TASK,
    payload
}) 