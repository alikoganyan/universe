export const SET_DIALOGS = 'SET_DIALOGS'
export const SET_CURRENT_DIALOGS = 'SET_CURRENT_DIALOGS'
export const SET_DIALOGS_USER_ID = 'SET_DIALOGS_USER_ID'

export const setDialogs = payload => ({
  type: SET_DIALOGS,
  payload,
})

export const setCurrentDialogs = payload => ({
  type: SET_CURRENT_DIALOGS,
  payload,
})

export const setDialogsUserId = payload => ({
  type: SET_DIALOGS_USER_ID,
  payload,
})
