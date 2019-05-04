import { SET_TASKS } from '../actions/tasksActions'
const initialState = {
    tasks: {},
}
const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TASKS:
            return {
                ...state,
                tasks: {...action.payload},
            }
        default:
            return state
    }
}

export default tasksReducer;