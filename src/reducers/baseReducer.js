import { SET_INTERNET_CONNECTION } from '../actions/baseActions'

const initialState = {
  connection: true,
}
const baseReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_INTERNET_CONNECTION:
      return { ...state, connection: payload }
    default:
      return state
  }
}

export default baseReducer
