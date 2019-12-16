import { store } from '../reducers/store'
import { UPDATE_UPLOAD_MESSAGE_PROGRESS } from './dialogsActions'

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const SET_MESSAGE = 'SET_MESSAGE'
export const ADD_GROUP_MESSAGE = 'ADD_GROUP_MESSAGE'
export const START_SEARCH = 'START_SEARCH'
export const STOP_SEARCH = 'STOP_SEARCH'
export const EDIT_MESSAGE = 'EDIT_MESSAGE'
export const GET_MESSAGES = 'GET_MESSAGES'
export const SET_ROOM = 'SET_ROOM'
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT'
export const SET_CURRENT_ROOM_ID = 'SET_CURRENT_ROOM_ID'
export const FORWARD_MESSAGE = 'FORWARD_MESSAGE'
export const REPLY_MESSAGE = 'REPLY_MESSAGE'
export const DELETE_MESSAGE = 'DELETE_MESSAGE'
export const SET_FILE = 'SET_FILE'

export const addMessage = payload => ({
  type: ADD_MESSAGE,
  payload,
})

export const setMessage = payload => ({
  type: SET_MESSAGE,
  payload,
})

export const editMessage = payload => ({
  type: EDIT_MESSAGE,
  payload,
})

export const startSearch = () => ({
  type: START_SEARCH,
})

export const stopSearch = () => ({
  type: STOP_SEARCH,
})

export const getMessages = payload => ({
  type: GET_MESSAGES,
  payload,
})

export const setRoom = payload => ({
  type: SET_ROOM,
  payload,
})

export const setCurrentChat = payload => ({
  type: SET_CURRENT_CHAT,
  payload,
})

export const setCurrentRoomId = payload => ({
  type: SET_CURRENT_ROOM_ID,
  payload,
})

export const forwardMessage = payload => ({
  type: FORWARD_MESSAGE,
  payload,
})

export const replyMessage = payload => ({
  type: REPLY_MESSAGE,
  payload,
})
export const deleteMessage = payload => ({
  type: DELETE_MESSAGE,
  payload,
})

export const setFile = payload => ({
  type: SET_FILE,
  payload,
})

export const setGeoLoading = room => {
  let { dialogsReducer: { dialogs = [] } = {} } = store.getState()
  const dialogIndex = dialogs.findIndex(
    ({ room: dialogRoom }) => room === dialogRoom,
  )
  if (dialogIndex !== -1) {
    if (dialogs[dialogIndex].messages && dialogs[dialogIndex].messages.length) {
      let messageIndex = dialogs[dialogIndex].messages.findIndex(
        item => item.id === -1,
      )

      if (messageIndex === -1) {
        messageIndex = dialogs[dialogIndex].messages.length
      }

      dialogs[dialogIndex].messages[messageIndex] = {
        isLoading: true,
        type: 'geo',
        viewers: [],
        sender: {},
        id: -1,
      }
    }
  }
  return {
    type: UPDATE_UPLOAD_MESSAGE_PROGRESS,
    payload: dialogs,
  }
}
