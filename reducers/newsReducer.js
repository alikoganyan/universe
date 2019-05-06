import { SET_NEWS, SET_FEED } from '../actions/newsActions'
const initialState = {
    news: [
        {
            sender: {
                img: 'https://facebook.github.io/react/logo-og.png',
                name: 'Константин Константинопольский'
            },
            text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
            hashtags: [
                '#Константин Константинопольский',
                '#kek'
            ],
            likes: 10,
            shares: 2,
            timeSent: '16 января 2018 17:17'
        },
        {
            sender: {
                img: 'https://facebook.github.io/react/logo-og.png',
                name: 'Константин Константинопольский'
            },
            text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
            hashtags: [
                '#Константин Константинопольский',
                '#kek'
            ],
            likes: 10,
            shares: 2,
            timeSent: '16 января 2018 17:17'
        },
        {
            sender: {
                img: 'https://facebook.github.io/react/logo-og.png',
                name: 'Константин Константинопольский'
            },
            text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
            hashtags: [
                '#Константин Константинопольский',
                '#kek'
            ],
            likes: 10,
            shares: 2,
            timeSent: '16 января 2018 17:17'
        },
        {
            sender: {
                img: 'https://facebook.github.io/react/logo-og.png',
                name: 'Константин Константинопольский'
            },
            text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
            hashtags: [
                '#Константин Константинопольский',
                '#kek'
            ],
            likes: 10,
            shares: 2,
            timeSent: '16 января 2018 17:17'
        },
        {
            sender: {
                img: 'https://facebook.github.io/react/logo-og.png',
                name: 'Константин Константинопольский'
            },
            text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
            hashtags: [
                '#Константин Константинопольский',
                '#kek'
            ],
            likes: 10,
            shares: 2,
            timeSent: '16 января 2018 17:17'
        },
    ],
    feed: {}
}
const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NEWS:
            return {
                ...state,
                news: [...action.payload],
            }       
        case SET_FEED:
            return {
                ...state,
                feed: {...action.payload},
            }
        default:
            return state
    }
}

export default newsReducer;