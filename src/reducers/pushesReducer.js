import {
  GET_PERMISSION_STATUS,
  ASK_PERMISSION_STATUS,
  PERMISSION_STATUS_FULFILLED,
  PERMISSION_STATUS_REJECTED,
  GET_PUSH_TOKEN,
  PUSH_TOKEN_FULFILLED,
  PUSH_TOKEN_REJECTED,
  ALL_PUSHES_REQUEST,
  ALL_PUSHES_FULFILLED,
  ALL_PUSHES_REJECTED,
  USER_PUSHES_REQUEST,
  USER_PUSHES_FULFILLED,
  USER_PUSHES_REJECTED,
  TASKS_PUSHES_REQUEST,
  TASKS_PUSHES_FULFILLED,
  TASKS_PUSHES_REJECTED,
  NEWS_PUSHES_REQUEST,
  NEWS_PUSHES_FULFILLED,
  NEWS_PUSHES_REJECTED,
} from '../actions/pushesActions'
import { LOG_OUT } from '../actions/userActions'

const initialState = {
  permissionsIsFetching: false,
  permissionsIsError: false,
  permissions: false,
  tokenIsFetching: false,
  tokenIsError: false,
  token: '',
  allPushesIsFetching: false,
  userPushesIsFetching: false,
  tasksPushesIsFetching: false,
  newsPushesIsFetching: false,
  allPushesIsError: false,
  userPushesIsError: false,
  tasksPushesIsError: false,
  newsPushesIsError: false,
}

const pushesReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case GET_PERMISSION_STATUS:
    case ASK_PERMISSION_STATUS:
      return { ...state, permissionsIsFetching: true }
    case PERMISSION_STATUS_FULFILLED:
      return {
        ...state,
        permissionsIsFetching: false,
        permissionsIsError: false,
        permissions: payload,
      }
    case PERMISSION_STATUS_REJECTED:
      return {
        ...state,
        permissionsIsFetching: false,
        permissionsIsError: true,
      }

    case GET_PUSH_TOKEN:
      return { ...state, tokenIsFetching: true }
    case PUSH_TOKEN_FULFILLED:
      return {
        ...state,
        token: payload || state.token || '',
        tokenIsFetching: false,
        tokenIsError: false,
      }
    case PUSH_TOKEN_REJECTED:
      return { ...state, tokenIsFetching: false, tokenIsError: true }

    case ALL_PUSHES_REQUEST:
      return { ...state, allPushesIsFetching: true }
    case ALL_PUSHES_FULFILLED:
      return { ...state, allPushesIsFetching: false, allPushesIsError: false }
    case ALL_PUSHES_REJECTED:
      return { ...state, allPushesIsFetching: false, allPushesIsError: true }
    case USER_PUSHES_REQUEST:
      return { ...state, userPushesIsFetching: true }
    case USER_PUSHES_FULFILLED:
      return { ...state, userPushesIsFetching: false, userPushesIsError: false }
    case USER_PUSHES_REJECTED:
      return { ...state, userPushesIsFetching: false, userPushesIsError: true }
    case TASKS_PUSHES_REQUEST:
      return { ...state, tasksPushesIsFetching: true }
    case TASKS_PUSHES_FULFILLED:
      return {
        ...state,
        tasksPushesIsFetching: false,
        tasksPushesIsError: false,
      }
    case TASKS_PUSHES_REJECTED:
      return {
        ...state,
        tasksPushesIsFetching: false,
        tasksPushesIsError: true,
      }
    case NEWS_PUSHES_REQUEST:
      return { ...state, newsPushesIsFetching: true }
    case NEWS_PUSHES_FULFILLED:
      return { ...state, newsPushesIsFetching: false, newsPushesIsError: false }
    case NEWS_PUSHES_REJECTED:
      return { ...state, newsPushesIsFetching: false, newsPushesIsError: true }

    case LOG_OUT:
      return initialState
    default:
      return state
  }
}

export default pushesReducer
