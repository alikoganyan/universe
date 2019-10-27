import { SET_NEWS, SET_FEED, ADD_FEED } from '../actions/newsActions'
import { LOG_OUT } from '../actions/userActions'
const initialState = {
  news: [],
  feed: {},
}
const newsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEWS:
      return {
        ...state,
        news: [...action.payload],
      }
    case ADD_FEED:
      return {
        ...state,
        news: [{ ...action.payload }, ...state.news],
      }
    case SET_FEED:
      return {
        ...state,
        feed: { ...action.payload },
      }
    case LOG_OUT:
        return initialState;
    default:
      return state
  }
}

export default newsReducer
