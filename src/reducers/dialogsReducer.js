import {
  SET_DIALOGS,
  SET_CURRENT_DIALOGS,
  ADD_UPLOAD_MESSAGE,
  REMOVE_UPLOAD_MESSAGE,
  UPDATE_UPLOAD_MESSAGE_PROGRESS,
} from '../actions/dialogsActions'
import { LOG_OUT } from '../actions/userActions'
const initialState = {
  dialogs: [],
  currentDialog: {},
}

const dialogsReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_DIALOGS:
    case ADD_UPLOAD_MESSAGE:
    case REMOVE_UPLOAD_MESSAGE:
    case UPDATE_UPLOAD_MESSAGE_PROGRESS:
      return { ...state, dialogs: payload ? [...payload] : [] }

    case SET_CURRENT_DIALOGS:
      return { ...state, currentDialog: { ...payload } }
    case LOG_OUT:
      return initialState
    default:
      return state
  }
}

export default dialogsReducer
