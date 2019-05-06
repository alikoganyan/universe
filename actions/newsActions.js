export const SET_NEWS = 'SET_NEWS';
export const SET_FEED = 'SET_FEED';
export const setFeed = (payload) => ({
    type: SET_FEED,
    payload,
})

export const setNews = (payload) => ({
    type: SET_NEWS,
    payload,
})

