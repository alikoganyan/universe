import {
    ADD_MESSAGE,
    GET_MESSAGES,
    START_SEARCH,
    STOP_SEARCH,
    SET_ROOM,
    SET_DIALOGS,
} from '../actions/messageActions'
const initialState = {
    search: false,
    currentRoom: null,
    messages: [],
    dialogs: []
}
const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_MESSAGES:
            return { ...state, messages: action.payload }
        case SET_ROOM:
            return { ...state, currentRoom: action.payload }
        case SET_DIALOGS:
            return { ...state, dialogs: action.payload }
        case ADD_MESSAGE:
            return { ...state, messages: [...state.messages, action.payload] }
        case STOP_SEARCH:
            return { ...state, search: false }
        case START_SEARCH:
            return { ...state, search: true }

    }
    return state;
}

export default messageReducer