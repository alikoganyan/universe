import { combineReducers } from 'redux'
import messageReducer from './messageReducer'
import userReducer from './userReducer'
import drawerReducer from './drawerReducer'
import dialogsReducer from './dialogsReducer'

export default combineReducers({
    messageReducer,
    userReducer,
    drawerReducer,
    dialogsReducer,

})