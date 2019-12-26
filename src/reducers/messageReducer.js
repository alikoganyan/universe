import {
  ADD_MESSAGE,
  GET_MESSAGES,
  START_SEARCH,
  STOP_SEARCH,
  SET_ROOM,
  SET_CURRENT_CHAT,
  SET_CURRENT_ROOM_ID,
  EDIT_MESSAGE,
  EDITED_MESSAGE,
  FORWARD_MESSAGE,
  REPLY_MESSAGE,
  SET_MESSAGE,
  DELETE_MESSAGE,
  SET_FILE,
  ADD_PRELOADER,
  REMOVE_PRELOADER,
} from '../actions/messageActions'
import { LOG_OUT } from '../actions/userActions'

const initialState = {
  search: false,
  currentRoom: null,
  currentChat: null,
  currentRoomId: null,
  editMessage: {},
  editedMessage: {},
  messages: [],
  message: {},
  forwardMessage: {},
  replyMessage: {},
  deleteMessage: {},
  file: {},
  uploadMessages: [],
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
    case SET_MESSAGE:
      return { ...state, message: { ...payload } }
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
    case EDITED_MESSAGE:
      return { ...state, editedMessage: payload }
    case FORWARD_MESSAGE:
      return { ...state, forwardMessage: payload }
    case REPLY_MESSAGE:
      return { ...state, replyMessage: payload }
    case DELETE_MESSAGE:
      return { ...state, deleteMessage: payload }
    case SET_FILE:
      return { ...state, file: payload }
    case ADD_PRELOADER:
      return { ...state, uploadMessages: [...payload] }
    case REMOVE_PRELOADER:
      return { ...state, uploadMessages: [...payload] }
    case LOG_OUT:
      return initialState
    default:
      return state
  }
}
