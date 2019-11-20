import { combineReducers } from 'redux'
import dialogsReducer from './dialogsReducer'
import drawerReducer from './drawerReducer'
import userReducer from './userReducer'
import messageReducer from './messageReducer'
import participantsReducer from './participantsReducer'
import tasksReducer from './tasksReducer'
import newsReducer from './newsReducer'
import pushesReducer from './pushesReducer'
import profileReducer from './profileReducer'

export default combineReducers({
  dialogsReducer,
  drawerReducer,
  userReducer,
  messageReducer,
  participantsReducer,
  tasksReducer,
  newsReducer,
  pushesReducer,
  profileReducer,
})
