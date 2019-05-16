import {
    SET_DIALOGS,
    SET_CURRENT_DIALOGS,
} from '../actions/dialogsActions'
const initialState = {
    dialogs: [],
    currentDialog: {},
}
const dialogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DIALOGS:
            return { ...state, dialogs: [...action.payload] }
        case SET_CURRENT_DIALOGS:
            return { ...state, currentDialog: {...action.payload} }
        default:
            return state
    }

}

export default dialogsReducer