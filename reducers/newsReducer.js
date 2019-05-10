import {SET_NEWS, SET_FEED} from '../actions/newsActions';
const initialState = {
  news: [],
  feed: {},
};
const newsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEWS:
      return {
        ...state,
        news: [...action.payload],
      };
    case SET_FEED:
      return {
        ...state,
        feed: {...action.payload},
      };
    default:
      return state;
  }
};

export default newsReducer;
