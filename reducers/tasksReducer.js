import { SET_TASKS, SET_TASK } from '../actions/tasksActions'
const initialState = {
    tasks: [],
    currentTask: {},
}
const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TASKS:
            return {
                ...state,
                tasks: [...action.payload],
            }
        case SET_TASK:
            return {
                ...state,
                currentTask: {...action.payload},
            }
        default:
            return state
    }
}

export default tasksReducer;