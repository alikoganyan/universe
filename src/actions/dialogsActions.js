export const SET_DIALOGS = 'SET_DIALOGS'
export const SET_DIALOG = 'SET_DIALOG'

export const SET_CURRENT_DIALOGS = 'SET_CURRENT_DIALOGS'
export const SET_DIALOGS_USER_ID = 'SET_DIALOGS_USER_ID'
export const ADD_UPLOAD_MESSAGE = 'ADD_UPLOAD_MESSAGE'
export const REMOVE_UPLOAD_MESSAGE = 'REMOVE_UPLOAD_MESSAGE'
export const UPDATE_UPLOAD_MESSAGE_PROGRESS = 'UPDATE_UPLOAD_MESSAGE_PROGRESS'
export const SET_FILE_LOADING = 'SET_FILE_LOADING'
export const SET_COMPANY_LOADING = 'SET_COMPANY_LOADING'
export const SET_DIALOG_VIEWERS = 'SET_DIALOG_VIEWERS'

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

export const setDialog = payload => ({
  type: SET_DIALOG,
  payload,
})

export const setDialogViewers = payload => ({
  type: SET_DIALOG_VIEWERS,
  payload,
})

export const setCompanyLoading = payload => ({
  type: SET_COMPANY_LOADING,
  payload,
})

export const setFileLoading = payload => dispatch =>
  dispatch({ type: SET_FILE_LOADING, payload })
