import {
    SET_TASKS, SET_TASK, SET_INC_TASK, SET_OUT_TASK, SET_ACTIVE_TASK, ADD_TASK
} from '../actions/tasksActions'
const initialState = {
    tasks: [],
    currentTask: {},
    activeTask: {},
    incTasks: [],
    outTasks: [],
}
const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TASKS:
            return {
                ...state,
                // FIXME:
                // tasks: [...action.payload],
                tasks: Array.isArray(action.payload) ? [...action.payload] : [action.payload],
            }
        case SET_TASK:
            return {
                ...state,
                currentTask: { ...action.payload },
            }
        case ADD_TASK:
            return {
                ...state,
                tasks: [{ ...action.payload }, ...state.tasks],
            }
        case SET_INC_TASK:
            return {
                ...state,
                incTasks: [...action.payload]
            }
        case SET_OUT_TASK:
            return {
                ...state,
                outTasks: [...action.payload]
            }
        case SET_ACTIVE_TASK:
            return {
                ...state,
                activeTask: { ...action.payload }
            }
        default:
            return state
    }
}

export default tasksReducer;