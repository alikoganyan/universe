import { SET_MY_PROFILE } from '../actions/profileAction'

const initialState = {
  myProfile: null,
}
const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MY_PROFILE:
      return { ...state, myProfile: action.payload }
    default:
      return state
  }
}

export default profileReducer