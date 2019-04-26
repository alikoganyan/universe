import {
    SET_DIALOGS,
} from '../actions/dialogsActions'
const initialState = {
    dialogs: [],
}
const dialogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DIALOGS:
            return { ...state, dialogs: action.payload }
        default:
            return state
    }

}

export default dialogsReducer