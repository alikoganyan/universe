import { combineReducers } from 'redux'

import dialogsReducer from './dialogsReducer'
import drawerReducer from './drawerReducer'
import userReducer from './userReducer'
import messageReducer from './messageReducer'
import participantsReducer from './participantsReducer'
import tasksReducer from './tasksReducer'
import newsReducer from './newsReducer'

export default combineReducers({
    dialogsReducer,
    drawerReducer, 
    userReducer, 
    messageReducer,
    participantsReducer,
    tasksReducer,
    newsReducer,
})