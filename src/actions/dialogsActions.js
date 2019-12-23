import { store } from '../reducers/store'

export const SET_DIALOGS = 'SET_DIALOGS'
export const SET_DIALOG = 'SET_DIALOG'

export const SET_CURRENT_DIALOGS = 'SET_CURRENT_DIALOGS'
export const SET_DIALOGS_USER_ID = 'SET_DIALOGS_USER_ID'
export const ADD_UPLOAD_MESSAGE = 'ADD_UPLOAD_MESSAGE'
export const REMOVE_UPLOAD_MESSAGE = 'REMOVE_UPLOAD_MESSAGE'
export const UPDATE_UPLOAD_MESSAGE_PROGRESS = 'UPDATE_UPLOAD_MESSAGE_PROGRESS'
export const SET_FILE_LOADING = 'SET_FILE_LOADING'
export const SET_COMPANY_LOADING = 'SET_COMPANY_LOADING'

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

export const addUploadMessage = ({
  room,
  src,
  type,
  isUploaded = false,
  created_at,
  sender,
  tempId,
  viewers,
  uploadProgress,
  enableUploadProgress = false,
}) => {
  let { dialogsReducer: { dialogs = [] } = {} } = store.getState()
  const dialogIndex = dialogs.findIndex(
    ({ room: dialogRoom }) => room === dialogRoom,
  )
  if (dialogIndex !== -1) {
    if (dialogs[dialogIndex].messages && dialogs[dialogIndex].messages.length) {
      dialogs[dialogIndex].messages.push({
        room,
        src,
        type,
        isUploaded,
        created_at,
        sender,
        tempId,
        viewers,
        uploadProgress,
        enableUploadProgress,
      })
    } else {
      dialogs[dialogIndex].messages = [
        {
          room,
          src,
          type,
          isUploaded,
          created_at,
          sender,
          tempId,
          viewers,
          uploadProgress,
          enableUploadProgress,
        },
      ]
    }
  }
  return {
    type: ADD_UPLOAD_MESSAGE,
    payload: dialogs,
  }
}

export const removeUploadMessage = ({ room, tempId }) => {
  let { dialogsReducer: { dialogs = [] } = {} } = store.getState()
  const dialogIndex = dialogs.findIndex(
    ({ room: dialogRoom }) => room === dialogRoom,
  )
  if (dialogIndex !== -1) {
    if (dialogs[dialogIndex].messages && dialogs[dialogIndex].messages.length) {
      const messageIndex = dialogs[dialogIndex].messages.findIndex(
        ({ tempId: messageTempId }) => tempId === messageTempId,
      )
      if (messageIndex !== -1) {
        const messages = [
          ...dialogs[dialogIndex].messages.filter(
            ({ tempId: messageTempId }) => tempId !== messageTempId,
          ),
        ]

        dialogs[dialogIndex].messages = messages
      }
    }
  }
  return {
    type: REMOVE_UPLOAD_MESSAGE,
    payload: dialogs,
  }
}

export const updateUploadMessageProgress = ({
  room,
  tempId,
  uploadProgress,
  isFile,
}) => {
  let { dialogsReducer: { dialogs = [] } = {} } = store.getState()
  const dialogIndex = dialogs.findIndex(
    ({ room: dialogRoom }) => room === dialogRoom,
  )
  if (dialogIndex !== -1 && isFile) {
    if (dialogs[dialogIndex].messages && dialogs[dialogIndex].messages.length) {
      let messageIndex = dialogs[dialogIndex].messages.findIndex(
        item => item.id === -1,
      )

      if (messageIndex === -1) {
        messageIndex = dialogs[dialogIndex].messages.length
      }
      dialogs[dialogIndex].messages[messageIndex] = {
        uploadProgress,
        isUploading: true,
        viewers: [],
        sender: {},
        id: -1,
        type: 'file',
        enableUploadProgress: true,
      }
    }
  }
  return {
    type: UPDATE_UPLOAD_MESSAGE_PROGRESS,
    payload: dialogs,
  }
}

export const setCompanyLoading = payload => ({
  type: SET_COMPANY_LOADING,
  payload,
})

export const setFileLoading = payload => dispatch =>
  dispatch({ type: SET_FILE_LOADING, payload })
