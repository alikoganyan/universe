import { SET_DIALOGS, SET_CURRENT_DIALOGS } from '../actions/dialogsActions'
const initialState = {
  dialogs: [],
  currentDialog: {},
}
export default dialogsReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_DIALOGS:
      return { ...state, dialogs: [...payload] }

    case SET_CURRENT_DIALOGS:
      return { ...state, currentDialog: { ...payload } }

    default:
      return state
  }
}
