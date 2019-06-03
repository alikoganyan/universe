export const SET_NEWS = 'SET_NEWS';
export const SET_FEED = 'SET_FEED';
export const ADD_FEED = 'ADD_FEED';
export const setNews = (payload) => ({
    type: SET_NEWS,
    payload,
})

export const setFeed = (payload) => ({
    type: SET_FEED,
    payload,
})
export const addFeed = (payload) => ({
    type: ADD_FEED,
    payload,
})


