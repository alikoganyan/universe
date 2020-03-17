import {
  SET_CONTACTS,
  SET_ERROR,
  SET_ALL_USERS,
  REGISTER_USER,
  SET_USER,
  SET_AUTH,
  SET_REGISTER_USER_NUMBER,
  SET_REGISTER_USER_SMS,
  ALTER_USER,
  SET_SETTINGS,
  SET_COMPANIES,
  LOG_OUT,
  SET_RESET,
  SET_PAS,
  SET_COMPANIES_DETAILS,
} from '../actions/userActions'
import {
  ENABLE_USER_PUSHES,
  DISABLE_USER_PUSHES,
} from '../actions/pushesActions'

const initialState = {
  user: {},
  contacts: [],
  auth: '',
  users: [],
  error: false,
  register: {
    phone: '',
    sms: '',
  },
  companies: [],
  company: {},
  reset: false,
  pas: '',
  companies_details: {},
}
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: { ...action.payload } }
    case SET_AUTH:
      return { ...state, auth: action.payload }
    case SET_PAS:
      return { ...state, pas: action.payload }
    case SET_COMPANIES_DETAILS:
      return {
        ...state,
        companies_details: { ...action.payload },
      }
    case SET_ERROR:
      return { ...state, error: action.payload }
    case SET_ALL_USERS:
      return { ...state, users: [1, 2] }
    case REGISTER_USER:
      return { ...state, register: { phone: action.payload } }
    case SET_REGISTER_USER_NUMBER:
      return {
        ...state,
        register: { ...state.register, phone: action.payload },
      }
    case SET_REGISTER_USER_SMS:
      return { ...state, register: { ...state.register, sms: action.payload } }
    case SET_CONTACTS:
      return { ...state, contacts: [...action.payload] }
    case ALTER_USER:
      const {
        email,
        first_name,
        last_name,
        middle_name,
        phone_number,
      } = action.payload
      return {
        ...state,
        user: {
          ...state.user,
          email,
          first_name,
          last_name,
          middle_name,
          phone_number,
        },
      }
    case SET_SETTINGS:
      return {
        ...state,
        user: { ...state.user, settings: { ...action.payload } },
      }
    case ENABLE_USER_PUSHES: {
      let settings =
        state.user && state.user.settings ? state.user.settings : {}
      settings = {
        ...settings,
        notifications: {
          ...action.payload,
        },
      }
      return { ...state, user: { ...state.user, settings } }
    }
    case DISABLE_USER_PUSHES: {
      let settings =
        state.user && state.user.settings ? state.user.settings : {}
      settings = {
        ...settings,
        notifications: {
          ...settings.notifications,
          all_users: false,
          tasks: false,
          news: false,
          initialized: true,
        },
      }
      return { ...state, user: { ...state.user, settings } }
    }
    case SET_COMPANIES: {
      return {
        ...state,
        companies: action.payload.companies,
        company: action.payload.company,
      }
    }
    case SET_RESET:
      return { ...state, reset: action.payload }
    case LOG_OUT:
      return initialState
    default:
      return state
  }
}

export default userReducer
