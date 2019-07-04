import {
  GET_PERMISSION_STATUS,
  ASK_PERMISSION_STATUS,
  PERMISSION_STATUS_FULFILLED,
  PERMISSION_STATUS_REJECTED,
  GET_PUSH_TOKEN,
  PUSH_TOKEN_FULFILLED,
  PUSH_TOKEN_REJECTED,
  USER_PUSHES_REQUEST,
  USER_PUSHES_FULFILLED,
  USER_PUSHES_REJECTED,
} from '../actions/pushesActions';

const initialState = {
  permissionsIsFetching: false,
  permissionsIsError: false,
  permissions: '',
  tokenIsFetching: false,
  tokenIsError: false,
  token: '',
  userPushesIsFetching: false,
  userPushesIsError: false,
};

export default (pushesReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PERMISSION_STATUS:
    case ASK_PERMISSION_STATUS:
      return { ...state, permissionsIsFetching: true };
    case PERMISSION_STATUS_FULFILLED:
      return {
        ...state,
        permissionsIsFetching: false,
        permissionsIsError: false,
        permissions: payload
      };
    case PERMISSION_STATUS_REJECTED:
      return {
        ...state,
        permissionsIsFetching: false,
        permissionsIsError: true
      };

    case GET_PUSH_TOKEN:
      return { ...state, tokenIsFetching: true };
    case PUSH_TOKEN_FULFILLED:
      return {
        ...state,
        token: payload || state.token || '',
        tokenIsFetching: false,
        tokenIsError: false
      };
    case PUSH_TOKEN_REJECTED:
      return { ...state, tokenIsFetching: false, tokenIsError: true };

    case USER_PUSHES_REQUEST:
      return { ...state, userPushesIsFetching: true, };
    case USER_PUSHES_FULFILLED:
      return { ...state, userPushesIsFetching: false, userPushesIsError: false };
    case USER_PUSHES_REJECTED:
      return { ...state, userPushesIsFetching: false, userPushesIsError: true };

    default:
      return state;
  }
});
