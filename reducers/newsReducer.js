import {SET_NEWS, SET_FEED} from '../actions/newsActions';
const initialState = {
  news: [],
  feed: {
    sender: {
      img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
      name: 'lol',
    },
    text: 'some text',
    likes: 10,
    timeSent: 'Сегодня в 15:00',
    comments: [
      {
        type: 'message',
        likes: 2,
        name: 'Константин Константинопольский',
        text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.',
        id: 0,
      },
      {
        type: 'message',
        likes: 2,
        name: 'Константин Константинопольский',
        text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.',
        id: 0,
      },
      {
        type: 'message',
        likes: 2,
        name: 'Константин Константинопольский',
        text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.',
        id: 0,
      },
      {
        type: 'message',
        likes: 2,
        name: 'Константин Константинопольский',
        text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.',
        id: 0,
      },
      {
        type: 'message',
        likes: 2,
        name: 'Константин Константинопольский',
        text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.',
        id: 0,
      },
      {
        type: 'message',
        likes: 2,
        name: 'Константин Константинопольский',
        text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.',
        id: 0,
      },
      {
        type: 'message',
        likes: 2,
        name: 'Константин Константинопольский',
        text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.',
        id: 0,
      },
      {
        type: 'message',
        likes: 2,
        name: 'Константин Константинопольский',
        text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.',
        id: 1,
      },
    ],
  },
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
