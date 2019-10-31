import {
  ADD_MESSAGE,
  GET_MESSAGES,
  START_SEARCH,
  STOP_SEARCH,
  SET_ROOM,
  SET_CURRENT_CHAT,
  SET_CURRENT_ROOM_ID,
  EDIT_MESSAGE,
  FORWARD_MESSAGE,
  REPLY_MESSAGE,
} from '../actions/messageActions'
import { LOG_OUT } from '../actions/userActions'

const initialState = {
  search: false,
  currentRoom: null,
  currentChat: null,
  currentRoomId: null,
  editMessage: {},
  messages: [],
  forwardMessage: {},
  replyMessage: {},
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

    case FORWARD_MESSAGE:
      return { ...state, forwardMessage: payload }

    case REPLY_MESSAGE:
      return { ...state, replyMessage: payload }
    case LOG_OUT:
        return initialState;
    default:
      return state
  }
}
