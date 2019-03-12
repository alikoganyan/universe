import {
    ADD_MESSAGE,
    ADD_GROUP_MESSAGE,
    START_SEARCH,
    STOP_SEARCH,
} from '../actions/messageActions'
const initialState = {
    search: false,
    messages: [
        { type: 'message', text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
        { type: 'message', text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 1 },
        { type: 'message', text: 'Irure cillum sunt ut pariatur laboris sint nisi.', id: 1 },
        { type: 'message', text: 'second message', id: 1 },
        { type: 'message', text: 'second message', id: 1 },
        {
            type: 'feed',
            sender: {
                img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                name: 'lol'
            },
            text: 'some text',
            hashtags: [
                '#lol',
                '#kek'
            ],
            likes: 10,
            shares: 2,
            timeSent: 'Сегодня в 15:00'
        },
        {
            type: 'task',
            title: 'Title',
            author: 1,
            text: 'Elit cupidatat Lorem nisi dolore aute ullamco ipsum aute. Ipsum commodo pariatur sit eiusmod ex dolore adipisicing sunt tempor laborum proident nostrud anim. Est fugiat reprehenderit velit laboris eiusmod consequat sit reprehenderit magna minim.',
            created: 1552297002599,
            deadline: 1552297012599,
            performers: [1, 2, 3],
            stage: 1,
        },
    ],
    groupMessages: [
        { type: 'message', text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
        { type: 'message', text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 1 },
        { type: 'message', text: 'Irure cillum sunt ut pariatur laboris sint nisi.', id: 1 },
        { type: 'message', text: 'second message', id: 1 },
        { type: 'message', text: 'second message', id: 1 },
        { type: 'message', text: 'third message', id: 2 },
        { type: 'message', text: 'third message', id: 2 },
        { type: 'message', text: 'third message', id: 2 },
        {
            type: 'feed',
            sender: {
                img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                name: 'lol'
            },
            text: 'some text',
            hashtags: [
                '#lol',
                '#kek'
            ],
            likes: 10,
            shares: 2,
            timeSent: 'Сегодня в 15:00'
        },
        {
            type: 'feed',
            sender: {
                img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                name: 'lol'
            },
            text: 'some text',
            hashtags: [
                '#lol',
                '#kek'
            ],
            likes: 10,
            shares: 2,
            timeSent: 'Сегодня в 15:00'
        },
    ],
}
const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return { ...state, messages: [{ text: action.payload, id: 1 }, ...state.messages] }
        case ADD_GROUP_MESSAGE:
            return { ...state, messages: [{ text: action.payload, id: 1 }, ...state.messages] }
        case STOP_SEARCH:
            return { ...state, search: false }
        case START_SEARCH:
            return { ...state, search: true }

    }
    return state;
}

export default messageReducer