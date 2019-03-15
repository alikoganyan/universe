import {
    ADD_MESSAGE,
    ADD_GROUP_MESSAGE,
    START_SEARCH,
    STOP_SEARCH,
} from '../actions/messageActions'
const initialState = {
    search: false,
    messages: [
        { type: 'message', text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
    ],
    groupMessages: [
        { type: 'message', text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
    ],
}
const messageReducer = (state = initialState, action) => {

    switch (action.type) {
        case ADD_MESSAGE:
            return { ...state, messages: [...state.messages, { type: 'message', text: action.payload.text, id: action.payload.userId }] }
        case ADD_GROUP_MESSAGE:
            return { ...state, groupMessages: [...state.groupMessages, { type: "message", text: action.payload.text, id: action.payload.userId }] }
        case STOP_SEARCH:
            return { ...state, search: false }
        case START_SEARCH:
            return { ...state, search: true }

    }
    return state;
}

export default messageReducer