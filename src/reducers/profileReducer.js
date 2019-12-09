import { SET_MY_PROFILE, SET_PROFILE } from '../actions/profileAction'

const initialState = {
  myProfile: null,
  profile: null,
}
const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MY_PROFILE:
      return { ...state, myProfile: action.payload }
    case SET_PROFILE:
      return { ...state, profile: action.payload }
    default:
      return state
  }
}

export default profileReducer
