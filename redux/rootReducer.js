import { combineReducers } from 'redux'

import auth from './Auth/reducer'
import user from './User/reducer'
import dialogs from './Dialogs/reducer'
import contacts from './Contacts/reducer'
import news from './News/reducer'
import tasks from './Tasks/reducer'
import settings from './Settings/reducer'
import new_dialog from './NewDialog/reducer'
import error from './Error/reducer'

export default combineReducers({
	auth,
	user,
    dialogs,
    contacts,
    news,
    tasks,
    settings,
    new_dialog,
    error
})