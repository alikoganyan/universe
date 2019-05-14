import { SET_TASKS } from '../actions/tasksActions'
const initialState = {
    tasks: [],
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
        default:
            return state
    }
}

export default tasksReducer;