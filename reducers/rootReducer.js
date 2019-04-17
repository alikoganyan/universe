import { combineReducers } from 'redux'

import dialogsReducer from './dialogsReducer'
import drawerReducer from './drawerReducer'
import userReducer from './userReducer'
import messageReducer from './messageReducer'

export default combineReducers({
    dialogsReducer,
    drawerReducer, 
    userReducer, 
    messageReducer,
})