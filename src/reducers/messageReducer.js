import {
  ADD_MESSAGE,
  GET_MESSAGES,
  START_SEARCH,
  STOP_SEARCH,
  SET_ROOM,
  SET_CURRENT_CHAT,
  SET_CURRENT_ROOM_ID,
  EDIT_MESSAGE,
} from '../actions/messageActions'

const initialState = {
  search: false,
  currentRoom: null,
  currentChat: null,
  currentRoomId: null,
  editMessage: {},
  messages: [],
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case GET_MESSAGES:
      return { ...state, messages: [...payload] }

    case SET_ROOM:
      return { ...state, currentRoom: payload }

    case ADD_MESSAGE:
      return { ...state, messages: [...state.messages, payload] }

    case STOP_SEARCH:
      return { ...state, search: false }

    case SET_CURRENT_CHAT:
      return { ...state, currentChat: payload }

    case SET_CURRENT_ROOM_ID:
      return { ...state, currentRoomId: payload }

    case START_SEARCH:
      return { ...state, search: true }

    case EDIT_MESSAGE:
      return { ...state, editMessage: payload }

    default:
      return state
  }
}
