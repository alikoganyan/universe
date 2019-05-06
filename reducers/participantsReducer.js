import { 
    ADD_TASK_RECEIVER, 
    SET_TASK_RECEIVERS, 
    ADD_FEED_RECEIVER, 
    ADD_DIALOG_PARTICIPANT, 
} from '../actions/participantsActions'
const initialState = {
    tasks: {
        receivers: []
    },
    dialog: {
        participants: []
    },
    news: {
        receivers: []
    }
}
const participantsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TASK_RECEIVER:
            return {
                ...state,
                tasks: { ...state.tasks, receivers: [...state.tasks.receivers, action.payload] },
            }
        case SET_TASK_RECEIVERS:
            return {
                ...state,
                tasks: { ...state.tasks, receivers: action.payload },
            }
        case ADD_FEED_RECEIVER:
            return {
                ...state,
                news: { ...state.news, receivers: [...state.news.receivers, action.payload] },
            }
        case ADD_DIALOG_PARTICIPANT:
            return {
                ...state,
                dialog: { ...state.dialog, participants: [...state.dialog.participants, action.payload] },
            }
        default: 
            return state
    }
}

export default participantsReducer;